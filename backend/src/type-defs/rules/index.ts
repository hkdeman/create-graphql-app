import { rule } from 'graphql-shield'

const isAuthenticated = rule()(async (_parent, _args, ctx, _info) => {
    console.log(ctx);
    return ctx.user !== null
})

export {
    isAuthenticated,
};