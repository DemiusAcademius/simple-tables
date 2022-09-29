import { ReactiveController, ReactiveControllerHost } from "lit"
import { Subscription } from "rxjs"
import { ObservableWithSnapshotFn } from "./rx-store"

export type EqualityCheck = (a: unknown, b: unknown) => boolean

export class RxController<T> implements ReactiveController {
    private _value: T
    private _subscription?: Subscription

    constructor(
        private host: ReactiveControllerHost,
        private observable: ObservableWithSnapshotFn<T>,
        private equalityCheck: EqualityCheck = tripleEquals,
    ) {
        this.host.addController(this)
        this._value = observable.snapshot()
    }


    public get value() {
        return this._value
    }

    hostConnected() {
        this._subscription = this.observable.subscribe(it => {
            if (!this.equalityCheck(this._value, it)) {
                this._value = it
                this.host.requestUpdate()
            }
        })
    }

    hostDisconnected() {
        this._subscription?.unsubscribe()
    }
}

const tripleEquals: EqualityCheck = (a, b) => a === b

export const shallowEquals: EqualityCheck = (a, b) => {
    if (a === b) {
        return true
    }

    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
        return false
    }

    const keys = Object.keys(a)
    if (keys.length !== Object.keys(b).length) {
        return false
    }

    for (const k of keys) {
        if ((a as any)[k] !== (b as any)[k]) {
            return false
        }
    }

    return true
}