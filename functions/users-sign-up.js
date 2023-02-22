require('dotenv').config()
const faunadb = require('faunadb')

const q = faunadb.query
let clientObject = null;

// TODO: Pull this into a util file
const client = () => {
    //singleton-style
    if (clientObject == null) {
        clientObject = new faunadb.Client({
            secret: process.env.FAUNADB_SECRET,
            domain: 'db.us.fauna.com'
        })
    }
    return clientObject;
}

module.exports.handler = async (event, context, callback) => {
    let payload = JSON.parse(event.body)

    //user_data part of payload can contain all that you want to store about the user but it must contain email for our login to work
    let user_data = payload.user_data

    const password = payload.password

    try {
        // create user
        const user = await client().query(
            q.Create(
                q.Collection('users'), {
                credentials: {
                    password: password
                },
                data: user_data
            }
            )
        )

        // login user
        const login = await client().query(
            q.Login(
                q.Match(q.Index('users_by_email'), user_data.email),
                { password: password }
            )
        )

        const response = Object.assign(user.data, { secret: login.secret })

        callback(null, {
            statusCode: 200,
            headers: {
                /* Required for CORS support to work */
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
            },
            body: JSON.stringify(response),
        })
    } catch (err) {
        console.error(err)
        callback(null, {
            statusCode: 400,
            headers: {
                /* Required for CORS support to work */
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
            },
            body: JSON.stringify({error: err}),
        })
    }
}