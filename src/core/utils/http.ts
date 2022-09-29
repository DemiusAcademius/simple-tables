export const HEADER_CONTENT_TYPE: string = 'Content-Type'

export const CONTENT_TYPE_FORM: string = 'application/x-www-form-urlencoded'
export const CONTENT_TYPE_JSON: string = 'application/json'

export type HttpParamType = string | number | boolean | undefined
export type HttpQueryType = Record<string, HttpParamType>

export type HttpQueryParams = {
    pathParams: HttpParamType[]
    queryParams?: HttpQueryType
}

export type QueryTranformer<P extends any[]> = (...args: P) => HttpQueryParams

export function urlFromParams(url: string, { pathParams, queryParams }: HttpQueryParams): string {
    let address = url
    if (!url.endsWith('/')) {
        address += '/'
    }
    address += pathParams.map(p => String(p)).join('/')
    if (queryParams) {
        address = encodeQuery(address, queryParams)
    }
    return address
}

export function encodeQuery(url: string, body: HttpQueryType): string {
    if (body) {
        const esc = encodeURIComponent
        const query = Object.keys(body)
            .map(k => ({ key: k, val: body[k] }))
            .filter(x => x.val)
            .map(x => esc(x.key) + '=' + esc(x.val!))
            .join('&')
        return url + "?" + query
    } else {
        return url
    }
}

export function parseQueryString(querystring: string): Map<string, string> {
    // remove any preceding url and split
    const qs = querystring.substring(querystring.indexOf('?') + 1).split('&')
    let params: Map<string, string> = new Map()

    // march and parse
    for (let i = qs.length - 1; i >= 0; i--) {
        const pair = qs[i].split('=')
        const key = decodeURIComponent(pair[0])
        const val = decodeURIComponent(pair[1] || '')
        params.set(key, val)
    }
    return params
}
