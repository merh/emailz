import { subscriptionState } from '../reducers/subscriptionSlice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import unsubscribe from '../containers/Unsubscribe'

export default function Unsubscribe() {
    const emailFromRedux = useSelector((state = subscriptionState) => state.subscription.email)
    const unsubscribed = useSelector((state = subscriptionState) => state.subscription.unsubscribed)
    const email = emailFromRedux && unsubscribed ? '' : emailFromRedux

    const dispatch = useDispatch()

    return (
        <main>
            {unsubscribe(dispatch, email)}
        </main>
    );
}
