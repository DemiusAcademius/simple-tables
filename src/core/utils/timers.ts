// execute something after delay (milliseconds)
export function later(delay: number) {
    return new Promise(resolve => {
        window.setTimeout(resolve, delay)
    })
}

// delay current thread (or fiber) asynchronously and run resolve function (return promise)
export function delay(time = 1500) {
    return new Promise(resolve => {
        const handle = window.setTimeout(() => {
            resolve(true)
            window.clearTimeout(handle)
        }, time)
    })
}

// used in class-based react _components
export function debouncer() {
    let debounceHandler: number | null = null

    const clear = () => {
        if (debounceHandler) {
            window.clearTimeout(debounceHandler)
            debounceHandler = null
        }
    }

    const delay = (timeout: number) => {
        if (debounceHandler) {
            window.clearTimeout(debounceHandler)
        }
        return new Promise(resolve => {
            debounceHandler = window.setTimeout(() => {
                debounceHandler = null
                resolve(true)
            }, timeout)
        })
    }

    const delayed = (callback: () => void, timeout: number) => {
        if (debounceHandler) {
            window.clearTimeout(debounceHandler)
        }
        debounceHandler = window.setTimeout(() => {
            debounceHandler = null
            callback()
        }, timeout)
    }

    return {
        clear, delay, delayed
    }
}
