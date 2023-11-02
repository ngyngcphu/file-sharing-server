import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { envs } from '@configs';
import { cookieOptions, DUPLICATED_USERNAME, LOGIN_FAIL, SALT_ROUNDS, USER_NOT_FOUND, SESSION_EXIST, DUPLICATED_LOGOUT } from '@constants';
import { LoginDto, SignupDto, LogoutDto } from '@dtos/in';
import { AuthResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { logger } from '@utils';

const login: Handler<AuthResultDto, { Body: LoginDto }> = async (req, res) => {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            username: true,
            password: true,
            isAvailable: true
        },
        where: { username: req.body.username }
    });
    if (!user) return res.badRequest(USER_NOT_FOUND);

    const correctPassword = await compare(req.body.password, user.password);
    if (!correctPassword) return res.badRequest(LOGIN_FAIL);

    const [sessionCurrents, totalSessionCurrents] = await prisma.$transaction([
        prisma.session.findMany({ select: { logoutTime: true }, where: { userId: user.id } }),
        prisma.session.count({ where: { userId: user.id } })
    ]);

    if (sessionCurrents.length && !sessionCurrents[totalSessionCurrents - 1].logoutTime) {
        return {
            id: user.id,
            message: SESSION_EXIST
        };
    } else {
        await prisma.user.update({ data: { isAvailable: true }, where: { id: user.id } });
        await prisma.session.create({
            data: {
                loginTime: moment().unix(),
                ipAddress: req.ip,
                userId: user.id
            }
        });
        const userToken = jwt.sign({ userId: user.id }, envs.JWT_SECRET);
        res.setCookie('token', userToken, cookieOptions);
        return {
            id: user.id,
            message: 'Login in successfully !'
        };
    }
};

const signup: Handler<AuthResultDto, { Body: SignupDto }> = async (req, res) => {
    const hashPassword = await hash(req.body.password, SALT_ROUNDS);
    let user: User;
    try {
        user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: hashPassword,
                fullName: req.body.fullName
            }
        });
    } catch (err) {
        logger.info(err);
        return res.badRequest(DUPLICATED_USERNAME);
    }

    const userToken = jwt.sign({ userId: user.id }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return {
        id: user.id,
        message: 'Sign up successfully !'
    };
};

const logout: Handler<string, { Body: LogoutDto }> = async (req, res) => {
    const [userId] = await prisma.$transaction([
        prisma.user.findUnique({ select: { id: true }, where: { id: req.body.id } }),
        prisma.user.update({ data: { isAvailable: false }, where: { id: req.body.id } })
    ]);

    const [session, totalSession] = await prisma.$transaction([
        prisma.session.findMany({
            select: {
                id: true,
                logoutTime: true
            },
            where: { userId: userId?.id }
        }),
        prisma.session.count({ where: { userId: userId?.id } })
    ]);
    if (!session[totalSession - 1].logoutTime) {
        await prisma.session.update({
            data: {
                logoutTime: moment().unix()
            },
            where: { id: session[totalSession - 1].id }
        });
        res.clearCookie('token');
        return 'Log out successfully !';
    } else {
        return DUPLICATED_LOGOUT;
    }
};

export const authHandler = {
    login,
    signup,
    logout
};
