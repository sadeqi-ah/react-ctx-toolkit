import { useEffect, useRef } from "react"

export type Listener<S> = (state: S) => void

export type ContextValue<V> = {
    value: { current: V }
    addListener: (listener: Listener<V>) => () => void
}

export function createProvider<S>(ContextProvider: React.Provider<ContextValue<S> | undefined>) {
    function Provider({ children, value }: { children: React.ReactNode; value: S }) {
        const stateRef = useRef<S>(value)
        const listenersRef = useRef<Set<Listener<S>>>(new Set<Listener<S>>())

        const context = useRef<ContextValue<S>>({
            value: stateRef,
            addListener: (listener: Listener<S>) => {
                listenersRef.current.add(listener)
                return () => {
                    listenersRef.current.delete(listener)
                }
            },
        })

        useEffect(() => {
            stateRef.current = value
            listenersRef.current.forEach((listener) => {
                listener(value)
            })
        }, [value])

        return <ContextProvider value={context.current}>{children}</ContextProvider>
    }
    return Provider
}
