import moment from 'moment';
import { SESSION_NOT_FOUND, FNAME_NOT_FOUND } from '@constants';
import { FileDto } from '@dtos/in';
import { FileResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';

const uploadMetadataFile: Handler<FileResultDto, { Body: FileDto }> = async (req, res) => {
    const session = await prisma.session.findUnique({
        select: {
            id: true
        },
        where: { id: req.body.sessionId }
    });
    if (!session) return res.badRequest(SESSION_NOT_FOUND);

    const fileExist = await prisma.sharedDocument.findUnique({
        where: {
            sessionId_name: {
                sessionId: req.body.sessionId,
                name: req.body.name
            }
        },
        select: {
            id: true
        }
    });
    if (fileExist) {
        const fileUpdate = await prisma.sharedDocument.update({
            data: {
                sharedTime: moment().unix(),
                size: req.body.size
            },
            where: { id: fileExist.id }
        });
        return {
            fileId: fileUpdate.id
        };
    } else {
        const file = await prisma.sharedDocument.create({
            data: {
                name: req.body.name,
                type: req.body.type,
                size: req.body.size,
                sharedTime: moment().unix(),
                sessionId: req.body.sessionId
            },
            select: {
                id: true
            }
        });
        return {
            fileId: file.id
        };
    }
};

const listHostName: Handler<string[], { Querystring: { fname: string } }> = async (req, res) => {
    const fname = req.query.fname;

    const listSessionIds = await prisma.sharedDocument.findMany({
        where: { name: fname },
        select: { sessionId: true }
    });
    if (!listSessionIds.length) return res.badRequest(FNAME_NOT_FOUND);

    const listHostNames = await prisma.session.findMany({
        where: {
            id: {
                in: listSessionIds.map((session) => session.sessionId)
            },
            logoutTime: null
        },
        select: {
            ipAddress: true
        }
    });

    const uniqueIPs = Array.from(new Set(listHostNames.map((hostname) => hostname.ipAddress)));
    return uniqueIPs;
};

export const fileHandler = {
    uploadMetadataFile,
    listHostName
};
