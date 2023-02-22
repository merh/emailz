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
    console.log(event.body)
    let payload = JSON.parse(event.body)

    const email = payload.email
    const password = payload.password

    try {
        const response = await client().query(
            q.Login(
                q.Match(q.Index('users_by_email'), email),
                { password: password }
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
            body: JSON.stringify({ error: err }),
        })
    }
}