import {
    configureStore,
    //getDefaultMiddleware,
} from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage/index.js'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import { authReducer } from './userSlice.js'
import { subscriptionReducer } from './subscriptionSlice.js'
import { usersReducer } from './usersSlice.js'

//const middleware = [
//    ...getDefaultMiddleware(),
//]

const combinedReducer = combineReducers({
    auth: authReducer,
    subscription: subscriptionReducer,
    users: usersReducer,
})

const persistConfig = {
    key: 'root',
    storage,
}

const reducer = persistReducer(persistConfig, combinedReducer )

const store = configureStore({
    reducer,
    middleware: [thunk, logger],
})

let persistor = persistStore(store)

export { store, persistor }
