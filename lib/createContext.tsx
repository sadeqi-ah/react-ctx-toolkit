import { createContext as createContextReact, useContext, useReducer } from "react"
import { Action } from "./createAction"
import { ContextValue, createProvider } from "./createProvider"
import { Reducer } from "./createReducer"
import { Selector, useSelector } from "./useSelector"

export type CreateContextOptions<S> = {
    displayName: string
    initialState: S
}

export function createContext<S>({ displayName, initialState }: CreateContextOptions<S>, reducer: Reducer<S, any>) {
    const Context = createContextReact<ContextValue<S> | undefined>(undefined)
    const DispatchContext = createContextReact<React.Dispatch<Action<any>> | undefined>(undefined)

    Context.displayName = `${displayName}.Context`
    DispatchContext.displayName = `${displayName}.DispatchContext`

    const ContextProvider = createProvider(Context.Provider)

    function Provider({ children }: { children: React.ReactNode }) {
        const [state, dispatch] = useReducer(reducer, initialState)
        return (
            <DispatchContext.Provider value={dispatch}>
                <ContextProvider value={state}>{children}</ContextProvider>
            </DispatchContext.Provider>
        )
    }
    Provider.prototype.displayName = `${displayName}.Provider`

    function useState<V = S>(selector?: Selector<S, V>) {
        return useSelector(Context, selector)
    }

    const useDispatch = () => {
        const dispatch = useContext(DispatchContext)
        if (dispatch === undefined) {
            throw new Error(`[${displayName}] must be used within a Provider`)
        }
        return dispatch
    }

    return { Provider, contexts: [Context, DispatchContext], hooks: [useState, useDispatch] } as const
}
