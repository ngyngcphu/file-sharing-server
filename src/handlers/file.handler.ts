import moment from 'moment';
import { SESSION_NOT_FOUND } from '@constants';
import { FileDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';

const uploadMetadataFile: Handler<string, { Body: FileDto }> = async (req, res) => {
    const session = await prisma.session.findUnique({
        select: {
            id: true
        },
        where: { id: req.body.sessionId }
    });
    if (!session) return res.badRequest(SESSION_NOT_FOUND);

    await prisma.sharedDocument.create({
        data: {
            name: req.body.name,
            type: req.body.type,
            size: req.body.size,
            sharedTime: moment().unix(),
            sessionId: req.body.sessionId
        }
    });
    return 'Upload metadata of file successfully !';
};

export const fileHandler = {
    uploadMetadataFile
};
