import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { USERS_RETRIEVE_ALL, USERS_MAKE_ADMIN, USERS_DELETE_ONE } from '../constants.js'


const usersState = {
    loading: false,
    error: "",
    users: [],
}

const fetchUsersCall = createAsyncThunk(USERS_RETRIEVE_ALL, args => {
    return fetch("/api/users-index", { method: 'GET', mode: 'cors', headers: { 'Authorization': `Bearer ${args.secret}` } })
        .then(response => {
            if (!response.ok) {
                args.setIsLoading(false)
                throw Error(response.statusText)
            }
            return response.json()
        })
        .then(json => {
            args.setIsLoading(false)
            return json
        })
        .then(json => json)
})

// { "email": "bar@bar.com", "upgrade": true, setIsLoading: fn }
const makeAdminCall = createAsyncThunk(USERS_MAKE_ADMIN, args => {
    return fetch("/api/users-make-admin", { method: 'POST', mode: 'cors', headers: { 'Authorization': `Bearer ${args.secret}` }, body: JSON.stringify({ "email": args.email, "upgrade": args.upgrade }) })
        .then(response => {
            if (!response.ok) throw Error(response.statusText)
            return response.json()
        })
        .then(json => {
            args.setIsLoading(false)
            return json
        })
        .then(json => json)
})

// { "email": "bar@bar.com", setIsLoading: fn }
const deleteUserCall = createAsyncThunk(USERS_DELETE_ONE, args => {
    return fetch("/api/users-delete", { method: 'DELETE', mode: 'cors', headers: { 'Authorization': `Bearer ${args.secret}` }, body: JSON.stringify({ "email": args.email }) })
        .then(response => {
            if (!response.ok) throw Error(response.statusText)
            return response.json()
        })
        .then(json => {
            args.setIsLoading(false)
            return json
        })
        .then(json => json)
})

const usersSlice = createSlice({
    name: "users",
    initialState: usersState,
    reducers: {
    },
    extraReducers: {
        [fetchUsersCall.pending]: state => {
            state.loading = true
            state.error = ""
        },
        [fetchUsersCall.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
        },
        [fetchUsersCall.fulfilled]: (state, action) => {
            state.loading = false
            state.error = ""
            //TODO: Map this into a user factory to return a user object with known attributes
            state.users = action.payload.data
        },
        [makeAdminCall.pending]: state => {
            state.loading = true
            state.error = ""
        },
        [makeAdminCall.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
        },
        [makeAdminCall.fulfilled]: (state, action) => {
            const existingUsers = JSON.parse(JSON.stringify(state.users)); // the parse of the stringify makes them concrete instead of proxy
            const updatedUser = action.payload.data[0].data // this is a user object, converting to array
            // TODO: Update users object in state to hold objects, not arrays of values
            state.loading = false
            state.error = ""
            //TODO: Map this into a user factory to return a user object with known attributes
            state.users = existingUsers.map(user => {
                if (user[1] === updatedUser.email) return [updatedUser.name, updatedUser.email, updatedUser.admin];
                return user;
            })
        },
        [deleteUserCall.pending]: state => {
            state.loading = true
            state.error = ""
        },
        [deleteUserCall.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
        },
        [deleteUserCall.fulfilled]: (state, action) => {
            const existingUsers = JSON.parse(JSON.stringify(state.users)); // the parse of the stringify makes them concrete instead of proxy
            const updatedUser = action.payload.data[0].data // this is a user object, converting to array
            // TODO: Update users object in state to hold objects, not arrays of values
            state.loading = false
            state.error = ""
            //TODO: Map this into a user factory to return a user object with known attributes
            state.users = existingUsers.filter(user => {
                if (user[1] !== updatedUser.email) return user;
                return false
            })
        }

    }
})

//const {} = authSlice.actions
const usersReducer = usersSlice.reducer

export { usersReducer, fetchUsersCall, makeAdminCall, deleteUserCall, usersState }
