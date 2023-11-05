import { Handler } from "@interfaces";
import { prisma } from "@repositories";
import { logger } from "@utils";

const getAllHostNames: Handler<string[]> = async (_req, res) => {
    try {
        const allHostNames = await prisma.session.findMany({
            where: { logoutTime: null },
            select: { ipAddress: true }
        });
        if (allHostNames.length > 0) {
            return allHostNames.map((hostName) => hostName.ipAddress);
        } else {
            return [];
        }
    } catch (err) {
        logger.error(err);
        return res.internalServerError(err);
    }
}

export const hostNameHandler = { getAllHostNames }