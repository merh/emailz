import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router'
import { authState } from '../reducers/userSlice'
import { useSelector } from 'react-redux'
import { logoutCall } from '../reducers/userSlice'

export default function Nav() {
    const dispatch = useDispatch()
    const email = useSelector((state = authState) => state.auth.email)
    const name = useSelector((state = authState) => state.auth.name)
    const secret = useSelector((state = authState) => state.auth.secret)
    const admin = useSelector((state = authState) => state.auth.admin)
    const navigate = useNavigate()
    const location = useLocation();

    const logout = () => {
        dispatch(logoutCall({ secret: secret }))
            .then(logoutResponse => {
                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true })
            })
    }

    const loggedInOut = () => {
        if (secret !== "") {
            return (
                <>
                    <span>{name || email}</span>{" "}
                    <button onClick={ logout }>Logout</button>
                </>
            )
        }
        return (
            <>
                <Link to="/register">Register</Link > | {" "}
                <Link to="/login">Login</Link>
            </>
        )
    }

    const adminLinks = () => {
        return (
            <>
                <Link to="/subscriptions">Subscriptions</Link> | {" "}
                <Link to="/users">Users</Link> | {" "}
            </>
        )
    }

    // TODO: Put all Links to be shown into an array before the return statement and then in the return map over the array and appropriate dividers
    return (
        <nav>
            <Link to="/">Subscribe</Link> | {" "}
            <Link to="/unsubscribe">Unsubscribe</Link> | {" "}
            <Link to="/gdpr">GDPR</Link> | {" "}
            {admin && adminLinks()}
            {loggedInOut()}
        </nav>
    );
}
