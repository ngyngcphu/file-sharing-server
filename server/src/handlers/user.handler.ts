import { USER_NOT_FOUND } from '@constants';
import { prisma } from '@repositories';
import { UserDto } from '@dtos/out';
import { Handler } from '@interfaces';

const getUserById: Handler<UserDto> = async (req, res) => {
    const userId = req.userId;
    const sessionId = req.sessionId;
    const user = await prisma.user.findUnique({
        select: {
            id: true
        },
        where: { id: userId }
    });
    const session = await prisma.session.findUnique({
        select: {
            id: true
        },
        where: { id: sessionId }
    });
    if (user === null || session === null) return res.badRequest(USER_NOT_FOUND);

    return {
        userId: user.id,
        sessionId: session.id
    };
};

export const usersHandler = {
    getUserById
};
