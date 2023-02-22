import { useState, useEffect } from 'react'
import { authState } from '../reducers/userSlice'
import { usersState } from '../reducers/usersSlice'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsersCall, makeAdminCall, deleteUserCall } from '../reducers/usersSlice'
import './spinner.css'

export default function Users() {
    const dispatch = useDispatch()
    const secret = useSelector((state = authState) => state.auth.secret)
    const users = useSelector((state = usersState) => state.users.users)
    const error = useSelector((state = usersState) => state.users.error)
    const errored = error !== ""
    const [isLoading, setIsLoading] = useState(errored);

    useEffect(() => {
        setIsLoading(true)
        dispatch(fetchUsersCall({ secret, setIsLoading }))
    }, [dispatch, secret])

    const loading = () => {
        // TODO: Center the spinner, abstract it out into a reusable component
        return (
            <div className="spinner-container">
                <div className="loading-spinner">
                </div>
            </div>
        )
    }

    const onClick = (args) => {
        let userValues = JSON.parse(args.target.dataset.user)
        let values = {}
        switch (args.target.outerText) {
            case 'Make Admin':
            case 'Remove Admin':
                values = {
                    secret: secret,
                    email: userValues[1],
                    upgrade: userValues[2] ? false : true,
                    setIsLoading: setIsLoading
                } // { "email": "bar@bar.com", "upgrade": true }
                dispatch(makeAdminCall(values))
                break
            case 'Delete':
                values = {
                    secret: secret,
                    email: userValues[1],
                    setIsLoading: setIsLoading
                } // { "email": "bar@bar.com", "upgrade": true }
                dispatch(deleteUserCall(values))
                break
            default:
                console.log('Button with no corresponding action clicked.')
        }
    }

    const userTable = () => {
        let mapKey = 0;
        return (
            <div className="flex-item padded-1">
                <h2 className="haggard-font">System Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Permissions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(userArray => {
                            console.log(userArray)
                            //if (userArray === null || userArray === undefined) return;
                            return(
                                <tr key={userArray[0] + userArray[1] + ++mapKey}>
                                    <td>{userArray[0]}</td>
                                    <td>{userArray[1]}</td>
                                    <td>{userArray[2] ? 'admin' : 'standard' }</td>
                                    <td><button onClick={onClick} data-user={JSON.stringify(userArray)}>{userArray[2] ? 'Remove Admin' : 'Make Admin'}</button> <button onClick={onClick} data-user={JSON.stringify(userArray)}>Delete</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    const failedToFetch = () => {
        return (
            <>
                <h2 className="haggard-font">System Users</h2>
                <h3>Failed to Fetch</h3>
                <p>Error: {error}</p>
            </>
        )
    }

    return (
        <main className="flex-container flex-column">
            {isLoading ? loading() : errored ? failedToFetch() : userTable()}
        </main>
    );
}
