import { createContext as createContextReact, useContext, useReducer } from "react"
import { Action } from "./createAction"

export type CreateContextOptions<S> = {
    displayName: string
    initialState: S
}

export function createContext<S>(
    { displayName, initialState }: CreateContextOptions<S>,
    reducer: (state: S, action: Action<any>) => S
) {
    const Context = createContextReact<S | undefined>(undefined)
    const DispatchContext = createContextReact<React.Dispatch<Action<any>> | undefined>(undefined)

    Context.displayName = `${displayName}.Context`
    DispatchContext.displayName = `${displayName}.DispatchContext`

    function Provider({ children }: { children: React.ReactNode }) {
        const [state, dispatch] = useReducer(reducer, initialState)
        return (
            <DispatchContext.Provider value={dispatch}>
                <Context.Provider value={state}>{children}</Context.Provider>
            </DispatchContext.Provider>
        )
    }
    Provider.prototype.displayName = `${displayName}.Provider`

    const useState = () => {
        const state = useContext(Context)
        if (state === undefined) {
            throw new Error(`[${displayName}] must be used within a Provider`)
        }
        return state
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
