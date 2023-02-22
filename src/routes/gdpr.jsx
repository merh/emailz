import { subscriptionState } from '../reducers/subscriptionSlice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import DeleteSubscription from '../containers/DeleteSubscription'

export default function Gdpr() {
    const emailFromRedux = useSelector((state = subscriptionState) => state.subscription.email)
    const unsubscribed = useSelector((state = subscriptionState) => state.subscription.unsubscribed)
    let email;
    email = emailFromRedux && unsubscribed ? '' : emailFromRedux

    const dispatch = useDispatch()

    return (
        <main>
            {DeleteSubscription(dispatch, email)}
        </main>
    );
}
