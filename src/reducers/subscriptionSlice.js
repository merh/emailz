import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit'
import { SUBSCRIPTIONS_SUBSCRIBE, SUBSCRIPTIONS_UNSUBSCRIBE, SUBSCRIPTIONS_GDPR, SUBSCRIPTIONS_RETRIEVE_ALL } from '../constants.js'


const subscriptionState = {
    loading: false,
    email: "",
    subscribed: "",
    unsubscribed: "",
    error: "",
    subscriptions: [],
}

// the shape of args should be a json array with a single email key:
// { "email": "foo@bar.com" }
const subscribeCall = createAsyncThunk(SUBSCRIPTIONS_SUBSCRIBE, (args, { dispatch }) => {
    return fetch("/api/subscriptions-create", { method: 'POST', mode: 'no-cors', body: JSON.stringify(args) })
        .then(response => {
            if (!response.ok) throw Error(response.statusText)
            return response.json()
        })
        .then(json => {
            //dispatch(profileFetchCall({ secret: json.secret, id: json.instance["@ref"].id }))
            return json
        })
        .then(json => json)
})

// the shape of args should be a json array with an email and action key:
// { "email": "foo@bar.com", "action": "unsubscribe" }
const unsubscribeCall = createAsyncThunk(SUBSCRIPTIONS_UNSUBSCRIBE, (args, { dispatch }) => {
    return fetch("/api/subscriptions-update", { method: 'POST', mode: 'no-cors', body: JSON.stringify(args) })
        .then(response => {
            if (!response.ok) throw Error(response.statusText)
            return response.json()
        })
        .then(json => {
            //dispatch(profileFetchCall({ secret: json.secret, id: json.instance["@ref"].id }))
            return json
        })
        .then(json => json)
})

// the shape of args should be a json array with a single email key:
// { "email": "foo@bar.com" }
const gdprCall = createAsyncThunk(SUBSCRIPTIONS_GDPR, (args, { dispatch }) => {
    return fetch("/api/subscriptions-delete", { method: 'DELETE', mode: 'cors', body: JSON.stringify(args) })
        .then(response => {
            if (!response.ok) throw Error(response.statusText)
            return response.json()
        })
        .then(json => {
            //dispatch here
            return json
        })
        .then(json => json)
})

// { "secret": "token string", "setIsLoading": fn }
const fetchSubscriptionsCall = createAsyncThunk(SUBSCRIPTIONS_RETRIEVE_ALL, args => {
    return fetch("/api/subscriptions-index", { method: 'GET', mode: 'cors', headers: { 'Authorization': `Bearer ${args.secret}` } })
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

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState: subscriptionState,
    reducers: {
        clearState: (state, action) => {
            state.email = ''
            state.name = ''
            state.admin = false
            state.error = ''
        }
    },
    extraReducers: {
        [subscribeCall.pending]: state => {
            state.loading = true
            state.error = ""
        },
        [subscribeCall.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
        },
        [subscribeCall.fulfilled]: (state, action) => {
            state.loading = false
            state.error = ""
            state.email = action.payload.data.email
            state.subscribed = action.payload.data.subscribed
            state.unsubscribed = action.payload.data.unsubscribed || ''
        },
        [unsubscribeCall.pending]: state => {
            state.loading = true
            state.error = ""
        },
        [unsubscribeCall.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
        },
        [unsubscribeCall.fulfilled]: (state, action) => {
            state.loading = false
            state.error = ""
            state.email = action.payload.data[0].data.email
            state.subscribed = action.payload.data[0].data.subscribed
            state.unsubscribed = action.payload.data[0].data.unsubscribed
        },
        [gdprCall.pending]: state => {
            state.loading = true
            state.error = ""
        },
        [gdprCall.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
        },
        [gdprCall.fulfilled]: (state, action) => {
            state.loading = false
            state.error = ""
            state.email = ''
            state.subscribed = ''
            state.unsubscribed = ''
        },
        [fetchSubscriptionsCall.pending]: state => {
            state.loading = true
            state.error = ""
        },
        [fetchSubscriptionsCall.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
            state.subscriptions = []
        },
        [fetchSubscriptionsCall.fulfilled]: (state, action) => {
            state.loading = false
            state.error = ""
            state.subscriptions = action.payload.data
        }

    }
})

const { clearState } = subscriptionSlice.actions
const subscriptionReducer = subscriptionSlice.reducer

export { clearState, subscriptionReducer, subscribeCall, unsubscribeCall, gdprCall, fetchSubscriptionsCall, subscriptionState }
