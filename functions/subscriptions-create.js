require('dotenv').config()
const faunadb = require('faunadb')

const q = faunadb.query
let clientObject = null;

// TODO: Pull this into a util file
const client = key => {
    //singleton-style
    if (clientObject == null) {
        clientObject = new faunadb.Client({
            secret: key,
            domain: 'db.us.fauna.com'
        })
    }
    return clientObject;
}

module.exports.handler = async (event, context, callback) => {
    let payload = JSON.parse(event.body)
    // TODO: Remove authentication for this call but use it in the admin calls
    // let authorization = event.headers.authorization.split(" ")
    // const token = authorization[1]
    const token = process.env.FAUNADB_SECRET

    try {
        const response = await client(token).query(
            q.Create(
                q.Collection('subscriptions'), {
                data: {
                    email: payload.email,
                    subscribed: new Date().toLocaleDateString(),
                    unsubscribed: null
                }
            }
            )
        )

        callback(null, {
            statusCode: 200,
            headers: {
                /* Required for CORS support to work */
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
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
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
            },
            body: JSON.stringify({error: err})
        })
    }
}
