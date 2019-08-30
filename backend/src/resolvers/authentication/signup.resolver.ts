import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma, Prisma} from '../../generated/prisma-client';

const signupResolver = async (_, args, { prisma: Prisma }, __) => {
    const roles = ["USER"];
    const password = await bcrypt.hash(args.password, 10)
    const user = await prisma.createUser({ ...args, password, roles })
    const token = jwt.sign({ userId: user.id, roles: user.roles }, process.env.APP_SECRET)
    return {
        token,
        user,
    }
};

export default signupResolver;