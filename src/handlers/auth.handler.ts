import { compare, hash } from 'bcrypt';
import { prisma } from '@repositories';
import { cookieOptions, DUPLICATED_USERNAME, LOGIN_FAIL, SALT_ROUNDS, USER_NOT_FOUND } from '@constants';
import jwt from 'jsonwebtoken';
import { envs } from '@configs';
import { User } from '@prisma/client';
import { LoginDto, SignupDto } from '@dtos/in';
import { AuthResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { logger } from '@utils';

const login: Handler<AuthResultDto, { Body: LoginDto }> = async (req, res) => {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            username: true,
            password: true
        },
        where: { username: req.body.username }
    });
    if (!user) return res.badRequest(USER_NOT_FOUND);

    const correctPassword = await compare(req.body.password, user.password);
    if (!correctPassword) return res.badRequest(LOGIN_FAIL);

    const userToken = jwt.sign({ userId: user.id }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return {
        id: user.id,
        username: user.username
    };
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
        username: user.username
    };
};

const logout: Handler<string> = async (_req, res) => {
    res.clearCookie('token');
    return 'Log out successfully !';
};

export const authHandler = {
    login,
    signup,
    logout
};
