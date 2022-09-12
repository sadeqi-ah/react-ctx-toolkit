import React, { useContext } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { createAction, createContext, createReducer } from "../lib"

type User = {
    name: string
}

type StateType = {
    users: User[]
    show?: boolean
}

const initialState: StateType = {
    users: [],
    show: false,
}

const pushUser = createAction<User>("user/push")
const popUser = createAction("user/pop")
const setShow = createAction<boolean>("user/setShow")

const reducer = createReducer<StateType>((builder) => {
    builder
        .addCase(pushUser, (state, action) => {
            state.users.push(action.payload)
            return state
        })
        .addCase(popUser, (state) => {
            state.users.pop()
            return state
        })
        .addCase(setShow, (state, action) => {
            state.show = action.payload
            return state
        })
})
const {
    Provider,
    contexts: [AppContext, AppDispatchContext],
    hooks: [useApp, useAppDispatch],
} = createContext({ displayName: "App", initialState }, reducer)

describe("createContext", () => {
    test("test context", () => {
        const App = () => {
            const app = useContext(AppContext)
            return <p>show: {`${app?.show}`}</p>
        }

        render(
            <Provider>
                <App />
            </Provider>
        )
        expect(screen.getByText(/^show:/)).toHaveTextContent("show: false")
    })

    test("test dispatch context", () => {
        const App = () => {
            const app = useContext(AppContext)
            const dispatch = useContext(AppDispatchContext)
            return (
                <>
                    <button onClick={() => dispatch && dispatch(pushUser({ name: "bob" }))}>add</button>
                    <p>name: {`${app?.users[0] && app.users[0].name}`}</p>
                </>
            )
        }

        render(
            <Provider>
                <App />
            </Provider>
        )
        fireEvent.click(screen.getByText("add"))
        expect(screen.getByText(/^name:/)).toHaveTextContent("name: bob")
    })

    test("test state custom hook", () => {
        const App = () => {
            const app = useApp()
            return <p>show: {`${app.show}`}</p>
        }

        render(
            <Provider>
                <App />
            </Provider>
        )
        expect(screen.getByText(/^show:/)).toHaveTextContent("show: false")
    })

    test("test dispatch custom hook", () => {
        const App = () => {
            const app = useApp()
            const dispatch = useAppDispatch()
            return (
                <>
                    <button onClick={() => dispatch(pushUser({ name: "bob" }))}>add</button>
                    <p>name: {`${app.users[0] && app.users[0].name}`}</p>
                </>
            )
        }

        render(
            <Provider>
                <App />
            </Provider>
        )
        fireEvent.click(screen.getByText("add"))
        expect(screen.getByText(/^name:/)).toHaveTextContent("name: bob")
    })
})
