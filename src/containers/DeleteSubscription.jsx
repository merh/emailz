import { Formik } from 'formik'
import { useNavigate } from 'react-router'
import { gdprCall } from '../reducers/subscriptionSlice'
import chevrolet from '../images/Chevrolet.jpeg'

export default function DeleteSubscription(dispatch, email = '') {
    const navigate = useNavigate()

    return (
        <div className="flex-container">
            <div className="flex-item two-thirds margined">
                <img src={chevrolet} alt="Rusted out blue Chevrolet" />
            </div>
            <div className="flex-item one-third padded">
                <h2 className="haggard-font">GDPR Me</h2>
                <p>{!email && 'Fill in your email then'} {email ? 'C' : 'c'}lick the button below if you wish to remove yourself from this system.</p>
                <Formik
                    initialValues={{ email: email }}
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
                            dispatch(gdprCall(values))
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
                                Delete Me
                            </button>
                        </form>
                    )
                    }
                </Formik>
            </div>
        </div>
    )
}
