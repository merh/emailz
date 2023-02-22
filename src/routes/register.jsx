import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import { Formik } from 'formik'
import { registerCall } from '../reducers/userSlice'

export default function Register() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();

    return (
        <main className="padded margined">
            <h2 className="haggard-font">Register</h2>
            <Formik
                initialValues={{ email: '', name: '', password: '' }}
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
                        dispatch(registerCall({ password: values.password, user_data: { name: values.name, email: values.email } }))
                            .then(response => {
                                setSubmitting(false)
                                return response
                            })
                            .then(response => {
                                const from = location.state?.from?.pathname || "/";
                                navigate(from, { replace: true })
                            })
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
                        <label htmlFor="name">Name</label>
                        <br />
                        <input
                            type="input"
                            name="name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                        />
                        {errors.name && touched.name && errors.name}
                        <br />
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
                            Register
                        </button>
                    </form>
                )
                }
            </Formik>
        </main>
    );
}
