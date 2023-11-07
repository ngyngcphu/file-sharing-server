import { HOSTNAME_NOT_FOUND } from "@constants";
import { FileAllHostNameDto } from "@dtos/out";
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

const listFileAvailable: Handler<FileAllHostNameDto[]> = async (_req, res) => {
    try {
        const listFileAvailable = await prisma.sharedDocument.findMany({
            where: {
                isAvailable: true,
                session: {
                    logoutTime: null
                }
            },
            select: {
                name: true,
                type: true,
                size: true,
                sharedTime: true,
                session: {
                    select: {
                        ipAddress: true,
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                sharedTime: 'desc'
            }
        });
        if (listFileAvailable.length > 0) {
            return listFileAvailable.map((file) => ({
                name: file.name,
                username: file.session.user.username,
                ipAddress: file.session.ipAddress,
                type: file.type,
                size: file.size,
                sharedTime: file.sharedTime
            }));
        } else {
            return [];
        }
    } catch (err) {
        logger.error(err);
        return res.internalServerError(err);
    }
}

export const hostNameHandler = {
    getAllHostNames,
    transferHostNameToIP,
    listFileAvailable
}