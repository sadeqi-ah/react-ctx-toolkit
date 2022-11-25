# react-ctx-toolkit

`react-ctx-toolkit` is a simple, compact, uncomplicated package inspired by `@reduxjs/toolkit` that includes helper functions for better coding with Context API

## Table of Content

-   [Installation](#installation)
-   [Getting Started](#getting-started)
-   [createAction](#createaction)
-   [createReducer](#createreducer)
-   [createContext](#createcontext)
-   [useSelector](#useselector)

## Installation

With yarn

```bash
yarn add react-ctx-toolkit
```

With NPM

```bash
npm install react-ctx-toolkit
```

## Getting Started

```typescript
const increment = createAction<number | undefined>("INCREMENT")
const decrement = createAction<number | undefined>("DECREMENT")

type CounterState = {
    count: number
}

const initialState: CounterState = {
    count: 0,
}

const reducer = createReducer<CounterState>((builder) => {
    builder
        .addCase(increment, (state, action) => {
            state.count += action.payload || 1
            return state
        })
        .addCase(decrement, (state, action) => {
            state.count -= action.payload || 1
            return state
        })
})

const {
    Provider: CounterProvider,
    hooks: [useCounter, useCounterDispatch],
} = createContext({ displayName: "Counter", initialState }, reducer)

function App() {
    const count = useCounter((state) => state.count)
    const dispatch = useCounterDispatch()

    const handleIncrement = () => {
        dispatch(increment(5))
    }

    const handleDecrement = () => {
        dispatch(decrement(5))
    }

    return (
        <>
            <button onClick={handleIncrement}>Increment</button>
            count: {count}
            <button onClick={handleDecrement}>Decrement</button>
        </>
    )
}

function Root() {
    return (
        <CounterProvider>
            <App />
        </CounterProvider>
    )
}
```

## createAction

A helper function for defining an action.

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
const decrement = createAction<number | undefined>("DECREMENT")

type StateType = {
    count: number
}

const reducer = createReducer<StateType>((builder) => {
    builder
        .addCase(increment, (state, action) => {
            state.count += action.payload || 1
            return state
        })
        .addCase(decrement, (state, action) => {
            state.count -= action.payload || 1
            return state
        })
})
```

## createContext

It is a helper function for creating context, provider, and hooks.

```typescript
const {
    Provider: CounterProvider,
    contexts: [CounterContext, CounterDispatchContext],
    hooks: [useCounter, useCounterDispatch],
} = createContext({ displayName: "Counter", initialState }, reducer)
```

## useSelector

In React Context when a context value is changed, all components that use `useContext` will re-render. `useSelector` helps you solve this issue and get better performance.

> If you use hooks exported from `createContext`, you don't need to use `useSelector`. because the hooks use `useSelector` internally.

```typescript
const theme = useSelector(AppContext, (state) => state.theme)
```
