import axios from "axios"

import { Notification } from "@vaadin/notification"

import { rxStore } from "../utils/rx-store"
import { parseQueryString } from "../utils/http"
import type { UserInfo } from "../utils/types"

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL

const SESSION_AUTHENTICATION_INFO = 'authentication-info'

export interface LoginRequest {
    username: string
    password: string
}

type AuthenticationInfo = {
    userInfo: UserInfo
    accessToken: string
    lastAuthorized: number
}

type AuthenticationOk = {
    authenticated: true
    accessToken: string
    userInfo: UserInfo
}

type AuthenticationFailed = {
    authenticated: false
    message: string
    takesLongWait: boolean
}

type AuthenticationResult = AuthenticationOk | AuthenticationFailed

export type LoginResult = { authenticated: true } | AuthenticationFailed

function checkAndParse(storageItem: string): AuthenticationInfo | null {
    const parsedStorageInfo = JSON.parse(storageItem)
    if (parsedStorageInfo.userInfo && parsedStorageInfo.accessToken && parsedStorageInfo.lastAuthorized && Number.isFinite(parsedStorageInfo.lastAuthorized)) {
        console.info('storageItem parsed and valid')
        return parsedStorageInfo as AuthenticationInfo
    }
    return null
}

const initializeAuthentication = () => {
    const storageItem = sessionStorage.getItem(SESSION_AUTHENTICATION_INFO)
    if (storageItem) {
        console.info('storageItem found')
        const authenticationInfo = checkAndParse(storageItem)
        if (authenticationInfo) {
            // this is a AuthenticationInfo
            const now = new Date().getTime()

            // token valid only 12 hours
            if ((authenticationInfo.lastAuthorized + 43200000) < now) {
                console.info('storageItem is outdated')
                // TODO: show notification
                // token in too old
                window.console.info(`session storage token invechit; last authorized: ${authenticationInfo.lastAuthorized}; now: ${now}`)
                // storage item is invalid
                return null
            }

            console.info('storageItem is actual')
            return authenticationInfo
        }
    }

    return null
}

export function authentication() {
    const [ready, ready$] = rxStore<boolean>(false)
    const [userInfoSubject, userInfo$] = rxStore<UserInfo | null>(null)

    const querystring = window.location.search
    const params = parseQueryString(querystring)

    const applicationID = params.get("application")
    window.console.info(`Authentication.constructor; application ID: ${applicationID}`)

    var accessToken: string | null = null

    const authenticationInfo = initializeAuthentication()

    const setLoggedIn = (userInfo: UserInfo, token: string) => {
        if (applicationID) {
            // external service
            // TODO: test if user has access to applicationID
            const url = applicationID
            console.info(`redirect to ${url}`)
            window.location.href = url
            return false
        } else {
            accessToken = token
            userInfoSubject.next(userInfo)
            // TODO: load MENU
            return true
        }
    }

    if (authenticationInfo == null) {
        sessionStorage.removeItem(SESSION_AUTHENTICATION_INFO)
        ready.next(true)
    } else {
        if (setLoggedIn(authenticationInfo.userInfo, authenticationInfo.accessToken)) {
            ready.next(true)
        }
    }

    const testServerless = async (body: LoginRequest) => {
        try {
            let result = await axios.post('https://hix63inpu3.execute-api.us-east-1.amazonaws.com/dev', {
                firstName: body.username,
                lastName: body.password
            })
            let data = result.data

            Notification.show(`Ok! : ${data}`, {
                position: 'bottom-center',
                theme: 'contrast',
                duration: 5000
            })
        } catch (ex) {
            console.error(`Test error: ${ex}`)
            Notification.show(`Err! : ${ex}`, {
                position: 'bottom-center',
                theme: 'error',
                duration: 5000
            })
        }
    }

    const login = async (body: LoginRequest): Promise<LoginResult> => {
        try {
            let result = await axios.post<AuthenticationResult>(`${AUTH_SERVICE_URL}/auth/login`, body)
            let data = result.data
            if (data.authenticated) {
                const authenticationInfo: AuthenticationInfo = { lastAuthorized: new Date().getTime(), userInfo: data.userInfo, accessToken: data.accessToken }
                sessionStorage.setItem(SESSION_AUTHENTICATION_INFO, JSON.stringify(authenticationInfo))
                setLoggedIn(data.userInfo, data.accessToken)
                return { authenticated: true }
            } else {
                return data
            }
        } catch (ex) {
            // TODO: if (axios.isAxiosError(error)) {
            let errorMessage
            if (ex.message && ex.status) {
                if (ex.status !== 401) {
                    errorMessage = 'inline'
                } else {
                    errorMessage = ex.message
                }
            } else {
                errorMessage = ex.toString()
            }
            return errorMessage
        }
    }

    const logout = () => {
        sessionStorage.removeItem(SESSION_AUTHENTICATION_INFO)
        accessToken = null
        userInfoSubject.next(null)
    }

    const getAccessToken: () => Readonly<string | null> = () => accessToken

    return ({
        login, logout, testServerless,
        ready$, userInfo$,
        getAccessToken
    })
}

export const AUTHENTICATION = authentication()