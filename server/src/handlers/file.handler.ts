import moment from 'moment';
import { SESSION_NOT_FOUND, FNAME_NOT_FOUND, HOSTNAME_NOT_FOUND } from '@constants';
import { FileDto, ListFileDto } from '@dtos/in';
import { FileResultDto, MetadataFileHostNameDto } from '@dtos/out';
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

const uploadListMetadatFile: Handler<number, { Body: ListFileDto }> = async (req, res) => {
    const session = await prisma.session.findUnique({
        select: {
            id: true
        },
        where: { id: req.body.sessionId }
    });
    if (!session) return res.badRequest(SESSION_NOT_FOUND);

    const data = req.body.listFileMetadata.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        sharedTime: moment().unix(),
        sessionId: req.body.sessionId
    }));

    const listFileMetadata = await prisma.sharedDocument.createMany({
        data: data
    });
    return listFileMetadata.count;
};

const discoverHostName: Handler<MetadataFileHostNameDto[], { Params: { hostName: string } }> =
    async (req, res) => {
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
        const listMetadataFile = await prisma.session.findMany({
            where: {
                ipAddress: listSessions.session[listSessions.session.length - 1].ipAddress,
            },
            include: { sharedDocuments: true }
        });


        const metadataFile = listMetadataFile[0].sharedDocuments;
        if (metadataFile.length > 0) {
            return metadataFile.map((file) => ({
                name: file.name,
                type: file.type,
                size: file.size,
                sharedTime: file.sharedTime,
                isAvailable: file.isAvailable
            }));
        } else {
            return [];
        }
    }

export const fileHandler = {
    uploadMetadataFile,
    listHostName,
    uploadListMetadatFile,
    discoverHostName
};
