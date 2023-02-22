import { Formik } from 'formik'
import { useNavigate } from 'react-router'
import { unsubscribeCall } from '../reducers/subscriptionSlice'
import { clearState } from '../reducers/subscriptionSlice'
import rust from '../images/Rust.png'

export default function Unsubscribe(dispatch, email = '') {
    const navigate = useNavigate()

    const onClick = (e) => {
        dispatch(clearState())
    }

    return (
        <>
            <div className="flex-container">
                <div className="flex-item one-third padded" id="unsubscribe">
                    <h2 className="haggard-font">You sure you want to unsubscribe?</h2>
                    <p>{!email && 'Fill in your email then'} { email ? 'C' : 'c' }lick the button below to miss out on beauties like this.</p>
                    <Formik
                        initialValues={{ email: email, action: 'unsubscribe' }}
                        validate={values => {
                            const errors = {}
                            if (!values.email) {
                                errors.email = 'Required'
                            } else if (
                                // Email standards are horrific and this regex leaves out a lot of valid email addresses
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                            ) {
                                errors.email = 'Invalid email address'
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                dispatch(unsubscribeCall(values))
                                setSubmitting(false)
                                navigate('/', { replace: true })
                            }, 400)
                        }
                        }
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                />
                                {errors.email && touched.email && errors.email}
                                <br />
                                <button type="submit" disabled={isSubmitting}>
                                    Unsubscribe
                                </button>
                            </form>
                        )
                        }
                    </Formik>
                </div>
                <div className="flex-item two-thirds margined">
                    <img src={rust} alt="Rusty classic car" />
                </div>
            </div>
            <div className="padded">
                <p>
                    Clear data without unsubscribing.
                </p>
                <button onClick={onClick}>Clear Data</button>
            </div>

        </>
    )
}
