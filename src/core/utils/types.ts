
export type UserInfo = {
    readonly personnelNr: number
    readonly username: string
    readonly telefon?: string
    readonly email?: string
    readonly passwordExpirationDate?: string // date
    readonly dateDismiss?: string // date
    readonly accountDisabled: boolean
    readonly roles: [string]
}

export type MenuGroup = {
    url: string
    icon: string
    text: string
    items: MenuItem[]
}

export type MenuItem = {
    url: string
    text: string
}

export type ViewRoute = {
    title?: string
    icon?: string
    description?: string
}

export type BooleanResponse = {
    response: boolean
}

export type StringResponse = {
    response: string
}

export type Pair<F, S> = {
    left: F
    right: S
}

export type SelectOption = {
    label: string
    value: number
}

export type CompleteCallback = () => void
