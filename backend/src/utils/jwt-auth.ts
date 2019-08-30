import * as jwt from 'jsonwebtoken';

function getUser(token) {
    try {
        if (token) {
            return jwt.verify(token, process.env.APP_SECRET)
        }
        return null
    } catch (err) {
        return null
    }
}

function getTokenFromHeaders(authorization) {
    const tokenWithBearer = authorization || ''
    const token = tokenWithBearer.split(' ')[1]
    return token
}

export {
    getUser,
    getTokenFromHeaders
}