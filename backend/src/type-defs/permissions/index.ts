import { isAuthenticated } from "../rules";
import { shield, and, or, not } from 'graphql-shield'


const permissions = shield({
    Query: {
    },
    Mutation: {
        login: isAuthenticated,
    },
    Subscription: {
        counter: isAuthenticated,
    }
})

export {
    permissions
};