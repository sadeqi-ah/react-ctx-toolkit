import { createAction, createReducer } from "../lib"

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

describe("createReducer", () => {
    test("normal test", () => {
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
        expect(reducer(initialState, pushUser({ name: "bob" }))).toEqual({ users: [{ name: "bob" }], show: false })
        expect(reducer(initialState, setShow(true))).toEqual({ users: [], show: true })
        expect(reducer({ users: [{ name: "bob" }], show: false }, popUser())).toEqual({ users: [], show: false })
    })

    test("add case with string type", () => {
        const pushUser = createAction<User>("user/push")

        const reducer = createReducer<StateType>((builder) => {
            builder
                .addCase(pushUser, (state, action) => {
                    state.users.push(action.payload)
                    return state
                })
                .addCase("toggleShow", (state) => {
                    state.show = !state.show
                    return state
                })
        })
        expect(reducer(initialState, pushUser({ name: "bob" }))).toEqual({ users: [{ name: "bob" }], show: false })
        expect(reducer(initialState, { type: "toggleShow" })).toEqual({ users: [], show: true })
    })
})
