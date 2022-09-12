import produce, { isDraft, isDraftable } from "immer"
import type { Draft } from "immer"
import { Action, AnyAction } from "./createAction"

export type Actions<T extends keyof any = string> = Record<T, Action>

export type CaseReducer<S = any, A extends Action = AnyAction> = (state: Draft<S>, action: A) => Draft<S>

export type CaseReducers<S, AS extends Actions> = {
    [T in keyof AS]: AS[T] extends Action ? CaseReducer<S, AS[T]> : void
}

export interface TypedActionCreator<Type extends string> {
    (...args: any[]): Action<Type>
    type: Type
}

export interface ActionReducerMapBuilder<State> {
    addCase<ActionCreator extends TypedActionCreator<string>>(
        actionCreator: ActionCreator,
        reducer: CaseReducer<State, ReturnType<ActionCreator>>
    ): ActionReducerMapBuilder<State>

    addCase<Type extends string, A extends Action<Type>>(
        type: Type,
        reducer: CaseReducer<State, A>
    ): ActionReducerMapBuilder<State>

    addDefaultCase(reducer: CaseReducer<State, AnyAction>): void
}

export function createReducer<S>(casesBuilder: (builder: ActionReducerMapBuilder<S>) => void) {
    const [actionsMap, defaultCaseReducer] = executeCasesBuilder(casesBuilder)
    return (state: S, action: Action) => {
        const caseReducer = actionsMap[action.type] || defaultCaseReducer
        if (caseReducer) {
            return produce(state, (draft) => {
                const result = caseReducer(draft, action)
                if (typeof result === "undefined") {
                    return isDraft(draft) && isDraftable(draft) ? undefined : draft
                }
                return result
            })
        }
        return state
    }
}

export function executeCasesBuilder<S>(
    builderCallback: (builder: ActionReducerMapBuilder<S>) => void
): [CaseReducers<S, any>, CaseReducer<S, AnyAction> | undefined] {
    const actionsMap: CaseReducers<S, any> = {}
    let defaultCaseReducer: CaseReducer<S, AnyAction> | undefined
    const builder = {
        addCase(typeOrActionCreator: string | TypedActionCreator<any>, reducer: CaseReducer<S>) {
            const type = typeof typeOrActionCreator === "string" ? typeOrActionCreator : typeOrActionCreator.type
            if (type in actionsMap) {
                throw new Error("addCase cannot be called with two reducers for the same action type")
            }
            actionsMap[type] = reducer
            return builder
        },
        addDefaultCase(reducer: CaseReducer<S, AnyAction>) {
            if (process.env.NODE_ENV !== "production") {
                if (defaultCaseReducer) {
                    throw new Error("`builder.addDefaultCase` can only be called once")
                }
            }
            defaultCaseReducer = reducer
            return builder
        },
    }
    builderCallback(builder)
    return [actionsMap, defaultCaseReducer]
}
