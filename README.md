# react-ctx-toolkit

`react-ctx-toolkit` is a simple, compact, uncomplicated package inspired by `@reduxjs/toolkit` that includes helper functions for better coding with Context API

## List of functions

-   [createAction](#createaction)
-   [createReducer](#createreducer)
-   [createContext](#createcontext)

## createAction

A helper function for defining a action.

```typescript
const increment = createAction<number | undefined>("INCREMENT")
increment() // { type: "INCREMENT" }
increment(2) // { type: "INCREMENT", payload: 2 }

/* ----------------- */

const addUser = createAction("ADD_USER", (name: string, age: number) => ({
    payload: { name, age },
}))
addUser("bob", "32")
// { type: "ADD_USER", payload: { name: "bob", age: "32" } }

/* ----------------- */

type User = {
    name: string
    age: number
}

const addUser = createAction<User>("ADD_USER")
addUser({ name: "bob", age: "32" })
// { type: "ADD_USER", payload: { name: "bob", age: "32" } }
```

## createReducer

A helper function for creating a reducer.

```typescript
const increment = createAction<number | undefined>("INCREMENT")
const decrease = createAction<number | undefined>("DECREASE")

type StateType = {
    count: number
}

const reducer = createReducer<StateType>((builder) => {
    builder
        .addCase(increment, (state, action) => {
            state.count += action.payload || 1
            return state
        })
        .addCase(decrease, (state, action) => {
            state.count -= action.payload || 1
            return state
        })
})
```

## createContext

It is a helper function to creating context, provider and hooks.

```typescript
const {
    Provider: CounterProvider,
    contexts: [CounterContext, CounterDispatchContext],
    hooks: [useCounter, useCounterDispatch],
} = createContext({ displayName: "Counter", initialState }, reducer)
```
