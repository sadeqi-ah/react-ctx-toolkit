import { IfMaybeUndefined, IfVoid, IsAny, IsUnknownOrNonInferrable } from "./tsHelper"

export interface Action<T = any> {
    type: T
}

export interface AnyAction extends Action {
    [extraProps: string]: any
}

export type ActionWithPayload<P = any, T extends string = string> = {
    type: T
    payload: P
}

export type PrepareAction<P> = (...args: any[]) => { payload: P }

export type _ActionCreatorWithPreparedPayload<
    PA extends PrepareAction<any> | void,
    T extends string = string
> = PA extends PrepareAction<infer P> ? ActionCreatorWithPreparedPayload<Parameters<PA>, P, T> : void

export type BaseActionCreator<P, T extends string> = {
    type: T
    match: (action: Action<unknown>) => action is ActionWithPayload<P, T>
}

export type ActionCreatorWithPreparedPayload<Args extends unknown[], P, T extends string = string> = {
    (...args: Args): ActionWithPayload<P, T>
} & BaseActionCreator<P, T>

export type ActionCreatorWithOptionalPayload<P, T extends string = string> = {
    (payload?: P): ActionWithPayload<P, T>
} & BaseActionCreator<P, T>

export type ActionCreatorWithoutPayload<T extends string = string> = {
    (): ActionWithPayload<undefined, T>
} & BaseActionCreator<undefined, T>

export type ActionCreatorWithPayload<P, T extends string = string> = {
    (payload: P): ActionWithPayload<P, T>
} & BaseActionCreator<P, T>

export type ActionCreatorWithNonInferrablePayload<T extends string = string> = {
    <PT>(payload: PT): ActionWithPayload<PT, T>
} & BaseActionCreator<unknown, T>

type IfPrepareActionMethodProvided<PA extends PrepareAction<any> | void, True, False> = PA extends (
    ...args: any[]
) => any
    ? True
    : False

export type PayloadActionCreator<
    P = void,
    T extends string = string,
    PA extends PrepareAction<P> | void = void
> = IfPrepareActionMethodProvided<
    PA,
    _ActionCreatorWithPreparedPayload<PA, T>,
    IsAny<
        P,
        ActionCreatorWithPayload<P, T>,
        IsUnknownOrNonInferrable<
            P,
            ActionCreatorWithNonInferrablePayload<T>,
            IfVoid<
                P,
                ActionCreatorWithoutPayload<T>,
                IfMaybeUndefined<P, ActionCreatorWithOptionalPayload<P, T>, ActionCreatorWithPayload<P, T>>
            >
        >
    >
>

export function createAction<P = void, T extends string = string>(type: T): PayloadActionCreator<P, T>

export function createAction<PA extends PrepareAction<any>, T extends string = string>(
    type: T,
    prepareAction: PA
): PayloadActionCreator<ReturnType<PA>["payload"], T, PA>

export function createAction(type: string, prepareAction?: (...args: any[]) => any): any {
    function actionCreator(...args: any[]) {
        if (prepareAction) {
            const prepared = prepareAction(...args)
            if (!prepared) {
                throw new Error("prepareAction did not return an object")
            }
            return {
                type,
                payload: prepared.payload,
            }
        }
        return { type, payload: args[0] }
    }

    actionCreator.type = type
    actionCreator.match = (action: Action<unknown>): action is Action => action.type === type
    actionCreator.toString = () => `${type}`

    return actionCreator
}
