import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import { authState } from '../reducers/userSlice'
import { subscribeCall, unsubscribeCall, fetchSubscriptionsCall, gdprCall, subscriptionState } from '../reducers/subscriptionSlice'
import './spinner.css'

export default function Subscriptions() {
    const dispatch = useDispatch()
    const secret = useSelector((state = authState) => state.auth.secret)
    // const users = useSelector((state = usersState) => state.users.users)
    const subscriptions = useSelector((state = subscriptionState) => state.subscription.subscriptions)
    const error = useSelector((state = subscriptionState) => state.subscription.error)
    const errored = error !== ""
    const [isLoading, setIsLoading] = useState(errored);
    const [showUnsubscribed, setShowUnsubscribed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        setIsLoading(true)
        if (secret) {
            dispatch(fetchSubscriptionsCall({ secret, setIsLoading }))
        } else {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true })
        }
    }, [dispatch, secret, setIsLoading, navigate, location])

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
        let subscriptionValues = JSON.parse(args.target.dataset.subscription)
        let values = {}
        switch (args.target.outerText) {
            case 'Unsubscribe':
                values = { email: subscriptionValues[0], action: 'unsubscribe' }
                setIsLoading(true)
                dispatch(unsubscribeCall(values))
                    .then(value => {
                        dispatch(fetchSubscriptionsCall({ secret, setIsLoading }))
                    }).catch(err => {
                        console.error(err)
                    }).finally(() => {
                        setIsLoading(false)
                    })
                break
            case 'Resubscribe':
                values = { email: subscriptionValues[0] }
                setIsLoading(true)
                dispatch(subscribeCall(values))
                    .then(value => {
                        dispatch(fetchSubscriptionsCall({ secret, setIsLoading }))
                    }).catch(err => {
                        console.error(err)
                    }).finally(() => {
                        setIsLoading(false)
                    })
                break
            case 'GDPR Delete':
                values = {
                    email: subscriptionValues[0],
                }
                setIsLoading(true)
                dispatch(gdprCall(values))
                    .then(value => {
                        dispatch(fetchSubscriptionsCall({ secret, setIsLoading }))
                    }).catch(err => {
                        console.error(err)
                    }).finally(() => {
                        setIsLoading(false)
                    })
                break
            default:
                console.log('Button with no corresponding action clicked.')
        }
    }

    const loadCsv = () => {
        const activeSubscriptions = subscriptions
            .filter(subscription => { return !subscription[2] })
            .map(subscription => { return subscription[0] } )
        return (
            <div className="flex-item padded-1">
                <h2 className="haggard-font">Only Active Subscriptions</h2>
                <h3>For copy/paste ease</h3>
                <p>
                    { activeSubscriptions.join(',') }
                </p>
            </div>
        )
    }

    const changeFilter = useCallback(
        e => {
            const { value } = e.target
            const castValue = value === 'true' ? true : false
            setShowUnsubscribed(castValue)
        },
        [setShowUnsubscribed]
    )

    const subscriptionsTable = (showUnsubscribed = false) => {
        let mapKey = 0;
        return (
            <>
                <h2 className="haggard-font">Subscriptions</h2>
                <div className="flex-item padded-1">
                    <input
                        type="radio"
                        name="show_unsubscribed"
                        value="false"
                        checked={showUnsubscribed === false}
                        onChange={changeFilter}
                    />Show Active
                    <input
                        type="radio"
                        name="show_unsubscribed"
                        value="true"
                        checked={showUnsubscribed === true}
                        onChange={changeFilter}
                    />Show All
                </div>
                <table className="flex-item padded-1">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Subscribed</th>
                            {(showUnsubscribed) ? <th>Unsubscribed</th> : null } 
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map(subscriptionArray => {
                            if (!showUnsubscribed && subscriptionArray[2]) return <></>;
                            //if (subscriptionArray === null || subscriptionArray === undefined) return;
                            return (
                                <tr key={subscriptionArray[0] + subscriptionArray[1] + ++mapKey}>
                                    <td>{subscriptionArray[0]}</td>
                                    <td>{subscriptionArray[1]}</td>
                                    {(showUnsubscribed) ? <td>{subscriptionArray[2]}</td> : null}
                                    <td><button onClick={onClick} data-subscription={JSON.stringify(subscriptionArray)}>{subscriptionArray[2] ? 'Resubscribe' : 'Unsubscribe'}</button> <button onClick={onClick} data-subscription={JSON.stringify(subscriptionArray)}>GDPR Delete</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <hr className="flex-item" />
                { loadCsv() }
            </>
        )
    }

    const failedToFetch = () => {
        return (
            <>
                <h2 className="haggard-font">Subscriptions</h2>
                <h3>Failed to Fetch</h3>
                <p>Error: {error}</p>
            </>
        )
    }

    return (
        <main className="flex-container flex-column">
            {isLoading ? loading() : errored ? failedToFetch() : subscriptionsTable(showUnsubscribed)}
        </main>
    );
}
