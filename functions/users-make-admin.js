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
    console.debug(event)
    let payload = JSON.parse(event.body)
    let authorization = event.headers.authorization.split(" ")
    const token = authorization[1]

    const email = payload.email
    const value = payload.upgrade ? true : null

    try {
        const response = await client(token).query(
            q.Map(
                q.Paginate(
                    q.Match('users_by_email', email),
                ),
                q.Lambda('x', q.Update(q.Var('x'), { data: { admin: value } }))
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
            body: JSON.stringify({ error: err }),
        })
    }
}