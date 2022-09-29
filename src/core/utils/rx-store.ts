import { BehaviorSubject, Observable } from "rxjs"

export type SnapshotFn<T> = {
    snapshot: () => Readonly<T>
}

export type ObservableWithSnapshotFn<T> = Observable<T> & SnapshotFn<T>
export type RxStore<T> = [BehaviorSubject<T>, ObservableWithSnapshotFn<T>]

export function rxStore<T>(initial: T): RxStore<T> {
    const subject = new BehaviorSubject<T>(initial)
    const observable$ = subject.asObservable()

    const snapshot = () => Object.freeze(subject.getValue())
    const enchanched = Object.assign(observable$, { snapshot })

    return ([
        subject, enchanched
    ])
}