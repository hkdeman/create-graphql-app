const { ApolloServer, PubSub } = require('apollo-server');
import * as path from 'path';
import * as dotenv from 'dotenv';
import typeDefs from './type-defs';
import { prisma } from './generated/prisma-client'

import { loginResolver, signupResolver } from './resolvers/authentication';
// import { permissions } from './typeDefs/permissions';
import { getUser, getTokenFromHeaders } from './utils/jwt-auth';


dotenv.config({ path: path.resolve(__dirname, '../.env') });

const resolvers = {
    Query: {
        info: (_parent, _args, { user }, _info) => {
            if (!user) {
                throw new Error('Not Authenticated!')
            }
            return 'Hello world!'
        }
    },
    Mutation: {
        login: loginResolver,
        signup: signupResolver
    },
    Subscription: {
        counter: {
            subscribe: (_parent, _args, { pubsub, user }, _info) => {
                if (!user) {
                    throw new Error('Not Authenticated!')
                }
                const channel = Math.random().toString(36).substring(2, 15) // random channel name
                let count = 0
                setInterval(() => pubsub.publish(channel, { counter: ++count }), 2000)
                return pubsub.asyncIterator(channel)
            },
        }
    },
}

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, connection }) => {
        if (connection) {
            // check connection for metadata
            return connection.context;
        } else {
            const token = getTokenFromHeaders(req.headers.authorization)
            const user = getUser(token)
            return {
                prisma,
                pubsub,
                user,
            }
        }
    },
    subscriptions: {
        onConnect: (connectionParams, webSocket) => {
            const token = getTokenFromHeaders(connectionParams.Authorization)
            const user = getUser(token)
            return {
                prisma,
                pubsub,
                user,
            }
        },
    },
})

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
})