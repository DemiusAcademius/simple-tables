/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AUTH_SERVICE_URL: string
    readonly VITE_COPYRIGHT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
