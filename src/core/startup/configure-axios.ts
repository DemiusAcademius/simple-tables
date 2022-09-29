import axios from "axios"
import { Notification } from "@vaadin/notification"
import { AUTHENTICATION } from "../services/authentication"
import { later } from "@core/utils/timers"

const ERR_NODATA_TEXT = 'Nu s-a găsit nimic pentru solicitarea dvs.'
const ERR_HTTP_REQUEST_INVALID_TEXT = 'Solicitarea catre server contine erori'
const ERR_NOTFOUND_TEXT = 'Resursa nu a fost gasita pe server'
const ERR_UNAUTHORIZED_TEXT = "Autentificarea a eșuat"
const ERR_INTERNAL_ERROR_TEXT = 'Hopa! Eroare internala la server'
const ERR_DEFAULT = "Hopa! Eroare neașteptată de interacţiune cu serverul"

export function configureAxios() {
    axios.interceptors.request.use(function (config) {
        const accessToken = AUTHENTICATION.getAccessToken()
        if (accessToken) {
            const token = `Bearer ${accessToken}`
            if (config.headers) {
                config.headers.Authorization = token
            } else {
                config.headers = { 'Authorization': token }
            }
        }
        return config
    }, function (error) {
        // Do something with request error
        return Promise.reject(error)
    })
    axios.interceptors.response.use(undefined, function (error) {
        let theme = 'error'
        let message

        // TODO: show detailed notification for auth error
        // 'Conectați-vă din nou la sistem sau clarificați-vă drepturile'

        switch (error.response.status) {
            case 204: message = ERR_NODATA_TEXT; break
            case 400: {
                message = ERR_HTTP_REQUEST_INVALID_TEXT
                theme = 'contrast'
            } break
            case 401: message = ERR_UNAUTHORIZED_TEXT; break
            case 404: {
                message = ERR_NOTFOUND_TEXT
                theme = 'contrast'
            } break
            case 500: message = ERR_INTERNAL_ERROR_TEXT; break
            default: message = ERR_DEFAULT
        }

        if (message != null) {
            Notification.show(message, {
                position: 'bottom-center',
                theme,
                duration: 4900
            })
        }

        if (error.response.status === 401 || error.response.data.message === '401 Unauthorized') {
            later(5000).then(() => {
                AUTHENTICATION.logout()
            })
        }

        return Promise.reject(error)
    })
}

configureAxios()