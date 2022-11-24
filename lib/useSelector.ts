import { Context, useContext, useEffect, useRef, useState } from "react"
import { ContextValue } from "./createProvider"

export type Selector<RS, S> = (state: RS) => S

export function useSelector<RS, S = RS>(context: Context<ContextValue<RS> | undefined>, selector?: Selector<RS, S>) {
    const displayName = (context.displayName && context.displayName.split(".")[0]) || "Unknown"
    const ctxValue = useContext<ContextValue<RS> | undefined>(context)
    if (!ctxValue) throw new Error(`[${displayName}] must be used within a Provider`)

    const { value, addListener } = ctxValue
    const selectorRef = useRef<Selector<RS, S> | undefined>(selector)
    const [selectedState, setSelectedState] = useState<S>(() =>
        selector ? selector(value.current) : (value.current as unknown as S)
    )

    useEffect(() => {
        selectorRef.current = selector
    }, [selector])

    useEffect(() => {
        return addListener((state: RS) => {
            setSelectedState(selectorRef.current ? selectorRef.current(state) : (state as unknown as S))
        })
    }, [])

    return selectedState
}
