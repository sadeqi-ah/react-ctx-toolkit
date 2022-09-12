/**
 * taken from https://github.com/reduxjs/redux-toolkit
 */

export type IsAny<T, True, False = never> = True | False extends (T extends never ? True : False) ? True : False

export type IsUnknown<T, True, False = never> = unknown extends T ? IsAny<T, False, True> : False

export type IfMaybeUndefined<P, True, False> = [undefined] extends [P] ? True : False

export type IfVoid<P, True, False> = [void] extends [P] ? True : False

export type IsEmptyObj<T, True, False = never> = T extends any
    ? keyof T extends never
        ? IsUnknown<T, False, IfMaybeUndefined<T, False, IfVoid<T, False, True>>>
        : False
    : never

export type AtLeastTS35<True, False> = [True, False][IsUnknown<ReturnType<<T>() => T>, 0, 1>]

export type IsUnknownOrNonInferrable<T, True, False> = AtLeastTS35<
    IsUnknown<T, True, False>,
    IsEmptyObj<T, True, IsUnknown<T, True, False>>
>

export interface TypeGuard<T> {
    (value: any): value is T
}
