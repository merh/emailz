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
    let authorization = event.headers.authorization?.split(" ")
    const token = authorization?.[1] // coalesce into undefined instead of throwing error if header missing
    console.log(token) // sometimes fails without this line?

    try {
        const response = await client(token).query(
            q.Paginate(
                q.Match(
                    q.Index('users_all'),
                )
            )
        )

        console.log(response)

        callback(null, {
            statusCode: 200,
            headers: {
                /* Required for CORS support to work */
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
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
                "Access-Control-Allow-Methods": "GET, OPTIONS",
            },
            body: JSON.stringify({ error: err })
        })
    }
}
