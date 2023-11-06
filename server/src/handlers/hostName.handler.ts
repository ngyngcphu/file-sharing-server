import { HOSTNAME_NOT_FOUND } from "@constants";
import { Handler } from "@interfaces";
import { prisma } from "@repositories";
import { logger } from "@utils";

const getAllHostNames: Handler<string[]> = async (_req, res) => {
    try {
        const allHostNames = await prisma.user.findMany({
            where: { isAvailable: true },
            select: { username: true }
        });
        if (allHostNames.length > 0) {
            return allHostNames.map((hostName) => hostName.username);
        } else {
            return [];
        }
    } catch (err) {
        logger.error(err);
        return res.internalServerError(err);
    }
}

const transferHostNameToIP: Handler<string, { Params: { hostName: string } }> = async (req, res) => {
    try {
        const hostName = req.params.hostName;
        const listSessions = await prisma.user.findUnique({
            where: {
                username: hostName,
                isAvailable: true
            },
            include: { session: true }
        });
        if (!listSessions) {
            return res.badRequest(HOSTNAME_NOT_FOUND);
        }
        return listSessions.session[listSessions.session.length - 1].ipAddress;

    } catch (err) {
        logger.error(err);
        return res.internalServerError(err);
    }
}

export const hostNameHandler = { getAllHostNames, transferHostNameToIP }