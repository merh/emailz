import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import { store, persistor } from './reducers/store.js'
import { PersistGate } from 'redux-persist/es/integration/react.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLocation, Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { authState } from './reducers/userSlice.js'
import './index.scss';
import App from './App.js';
import Gdpr from './routes/gdpr.jsx';
import Home from './routes/home.jsx';
import Login from './routes/login.jsx';
import Register from './routes/register.jsx';
import Subscriptions from './routes/subscriptions.jsx';
import Unsubscribe from './routes/unsubscribe.jsx';
import Users from './routes/users.jsx';
import reportWebVitals from './reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
//TODO: redirect to home if user doesn't have permission to hit intended route
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App />} >
                            <Route path="/" element={<Home />} />
                            <Route path="unsubscribe" element={<Unsubscribe />} />
                            <Route path="gdpr" element={<Gdpr />} />
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="users" element={<RequireAuth><Users /></RequireAuth>} />
                            <Route path="subscriptions" element={<RequireAuth><Subscriptions /></RequireAuth>} />
                            <Route path="*" element={
                                <main>
                                    <p>There's nothing here!</p>
                                </main>
                            }
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

function RequireAuth({ children }) {
    let location = useLocation();
    //const navigate = useNavigate()
    const secret = useSelector((state = authState) => state.auth.secret)
    const admin = useSelector((state = authState) => state.auth.admin)
   

    if (!secret) {
        //navigate("/login", { replace: true }) // example from login.jsx
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    if (!admin) {
        return <Navigate to="/" state={{ from: location }} replace />
    }

    return children
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
