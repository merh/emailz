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
    console.log(event.body)
    let payload = JSON.parse(event.body)
    // TODO: Remove authentication for this call but use it in the admin calls
    //let authorization = event.headers.authorization.split(" ")
    //const token = authorization[1]
    const token = process.env.FAUNADB_SECRET

    console.log('payload: ', payload, payload.email, payload["email"])
    const email = payload.email
    console.log(`function deleting email ${email}`)

    try {
        const response = await client(token).query(
            q.Map(
                q.Paginate(
                    q.Match('subscriptions_by_email', email),
                ),
                q.Lambda('x', q.Delete(q.Var('x')))
            )
        )

        callback(null, {
            statusCode: 200,
            headers: {
                /* Required for CORS support to work */
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "DELETE, OPTIONS",
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
                "Access-Control-Allow-Methods": "DELETE, OPTIONS",
            },
            body: JSON.stringify({ error: err })
        })
    }
}
