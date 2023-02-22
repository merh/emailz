require('dotenv').config()
const faunadb = require('faunadb')
import { returnError } from './utils/boilerplate.js'

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

const subscribe = () => {
    return {
        subscribed: new Date().toLocaleDateString(),
        unsubscribed: null
    }
}

const unsubscribe = () => {
    return { unsubscribed: new Date().toLocaleDateString() }
}

module.exports.handler = async (event, context, callback) => {
    let payload = JSON.parse(event.body)
    // TODO: Remove authentication for this call but use it in the admin calls
    //let authorization = event.headers.authorization.split(" ")
    //const token = authorization[1]
    const token = process.env.FAUNADB_SECRET

    const email = payload.email
    const action = payload.action
    let data;

    switch (action) {
        case 'subscribe':
            data = subscribe()
            break
        case 'unsubscribe':
            data = unsubscribe()
            break
        default:
            returnError(callback, 400, 'Unsupported action')
    }

    try {
        const response = await client(token).query(
            q.Map(
                q.Paginate(
                    q.Match('subscriptions_by_email', email),
                ),
                q.Lambda('x', q.Update(q.Var('x'), { data: data }))
            )
        )

        callback(null, {
            statusCode: 200,
            headers: {
                /* Required for CORS support to work */
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "PATCH, OPTIONS",
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
                "Access-Control-Allow-Methods": "PATCH, OPTIONS",
            },
            body: JSON.stringify({ error: err })
        })
    }
}
