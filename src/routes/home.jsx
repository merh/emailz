import { subscriptionState } from '../reducers/subscriptionSlice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import subscribe from '../containers/Subscribe'
import subscribed from '../containers/Subscribed'

export default function Home() {
    const dispatch = useDispatch()
    const email = useSelector((state = subscriptionState) => state.subscription.email)
    const unsubscribed = useSelector((state = subscriptionState) => state.subscription.unsubscribed)

    return (
        <main>
            { email && !unsubscribed ? subscribed() : subscribe(dispatch) }
        </main>
    );
}
