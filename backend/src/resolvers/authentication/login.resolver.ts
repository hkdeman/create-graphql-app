import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const loginResolver = async (_, args, context, __) => {
    const user = await context.prisma.user({ email: args.email })
    if (!user) {
        throw new Error('No such user found')
    }
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }
    const token = jwt.sign({ userId: user.id, roles: user.roles }, process.env.APP_SECRET)
    return {
        token,
        user,
    }
};

export default loginResolver;