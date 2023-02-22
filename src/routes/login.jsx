import { Formik } from 'formik'
import { loginCall } from '../reducers/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { authState } from '../reducers/userSlice'
import { useEffect } from 'react'

export default function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const secret = useSelector((state = authState) => state.auth.secret)
    const location = useLocation();
    const profileFetching = useSelector((state = authState) => state.auth.profileFetching)
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (secret && !profileFetching) {
            navigate(from, { replace: true })
        }
    }, [secret, navigate, profileFetching, from])

    return (
        <main className="padded margined">
            <h2 className="haggard-font">Login</h2>
            <Formik
                initialValues={{ email: '', password: '' }}
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
                    dispatch(loginCall(JSON.stringify(values)))
                    setSubmitting(false)
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
                    <label htmlFor="email">Email</label>
                    <br />
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                    />
                    {errors.email && touched.email && errors.email}
                    <br />
                    <label htmlFor="password">Password</label>
                    <br />
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                    />
                    {errors.password && touched.password && errors.password}
                    <br />
                    <button type="submit" disabled={isSubmitting}>
                        Submit
                    </button>
                    </form>
                )
            }
            </Formik>
        </main>
        );
}
