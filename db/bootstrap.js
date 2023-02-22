require('dotenv').config()
const faunadb = require('faunadb')

console.log('Creating FaunaDB database...')

const q = faunadb.query
let client = null;

const findOrCreateClient = () => {
    //singleton-style
    if (client == null) {
        console.log('creating client')
        client = new faunadb.Client({
            secret: process.env.FAUNADB_SECRET,
            domain: 'db.us.fauna.com'
        })
    }
    return client;
}

const createCollections = () => {
    findOrCreateClient().query(
        q.CreateCollection({ name: 'users' })
    )
        .then(ret => console.log('createCollections users Success: %s', ret))
        .catch(err => console.error('createCollections users Error: %s', err))

    findOrCreateClient().query(
        q.CreateCollection({ name: 'subscriptions' })
    )
        .then(ret => console.log('createCollections subscriptions Success: %s', ret))
        .catch(err => console.error('createCollections subscriptions Error: %s', err))

}

const createIndexes = () => {
    findOrCreateClient().query(
        q.CreateIndex({
            name: 'users_by_email',
            permissions: { read: "public" },
            source: q.Collection("users"),
            terms: [{ field: ["data", "email"] }],
            unique: true,
        })
    )
        .then(ret => console.log('createIndexes users_by_email Success: %s', ret))
        .catch(err => console.error('createIndexes users_by_email Error: %s', err))

    findOrCreateClient().query(
        q.CreateIndex({
            name: 'subscriptions_by_email',
            permissions: { read: "public" },
            source: [q.Collection("subscriptions")],
            terms: [{ field: ["data", "email"] }],
        })
    )
        .then(ret => console.log('createIndexes subscriptions_by_email Success: %s', ret))
        .catch(err => console.error('createIndexes subscriptions_by_email Error: %s', err))
}

const createRoles = () => {
    findOrCreateClient().query(
        // TODO: Make permissions more restrictive
        q.CreateRole({
            name: "data_pullers",
            membership: [
                {
                    resource: q.Collection("users"),
                }
            ],
            privileges: [
                {
                    resource: q.Collection("subscriptions"),
                    actions: {
                        read: true,
                        write: true,
                        create: true,
                        delete: true,
                        history_read: false,
                        history_write: false,
                        unrestricted_read: false
                    }
                },
                {
                    resource: q.Index("subscriptions_by_email"),
                    actions: {
                        unrestricted_read: false,
                        read: true
                    }
                },
            ],
        })
    )
        .then(ret => console.log('createRoles Success: %s', ret))
        .catch(err => console.error('createRoles Error: %s', err))
}

if (!process.env.FAUNADB_SECRET) {
    console.error('FaunaDB Secret Key not found!')
} else {
    console.log('creating collections')
    createCollections()
    console.log('creating indexes')
    createIndexes()
    console.log('creating roles')
    createRoles()
}
