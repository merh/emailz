import { Formik } from 'formik'
import { subscribeCall } from '../reducers/subscriptionSlice'
//import header from '../images/cadillac.jpg'
import paintHero from '../images/Craigslist-Find-Classic-GM-Car-Hoard2.jpg'
import chevyTruck from '../images/chevy-truck.jpg'
import chevelle from '../images/Craigslist-Find-Classic-GM-Car-Hoard-5.jpg'

export default function Subscribe(dispatch) {

    return (
        <>
            <div className="flex-container">
                <div className="flex-item two-thirds padded margined">
                    <img src={paintHero} alt="Beater Cadillac" />
                </div>
                <div className="flex-item one-third padded margined" id="signup">
                    <h2 className="haggard-font">Get pictures of real cars in your email</h2>
                    <p>Not every car can be a <a href="https://www.hagerty.com/media/market-trends/hagerty-insider/rumor-mercedes-benz-silver-arrow-sold-for-record-142-million/" target="_blank" rel="noreferrer">$142M Mercedes-Benz Silver Arrow</a>! Subscribe to our mailing list for weekly emails of pictures of cars that have had better days.</p>
                    <Formik
                        initialValues={{ email: '' }}
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
                                dispatch(subscribeCall(values))
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
                                <br />
                                {errors.email && touched.email && errors.email}
                                <br />
                                <button type="submit" disabled={isSubmitting}>
                                    Subscribe
                                </button>
                            </form>
                        )
                        }
                    </Formik>
                </div>
            </div>

            <div className="flex-container">
                <div className="flex-item one-third padded margined">
                    <h2 className="haggard-font">You want this</h2>
                    <p>Nothing to it, just pictures of cars that look like you before you've had your first cup of coffee.</p>
                    <a href="#signup"><button>Treat yourself</button></a>
                </div>
                <div className="flex-item two-thirds margined">
                    <img src={chevyTruck} alt="Rusted Out Chevy Truck" />
                </div>
            </div>

            <div className="flex-container">
                <div className="flex-item two-thirds margined">
                    <img src={chevelle} alt="Rotted out Chevelle and rusting friend" />
                </div>
                <div className="flex-item one-third padded margined">
                    <h2 className="haggard-font">Really?</h2>
                    <p>What do you think you're going to find down here? Just more great pictures and another link to the signup form.</p>
                    <a href="#signup"><button>Just sign up</button></a>
                </div>
            </div>
        </>
    )
}
