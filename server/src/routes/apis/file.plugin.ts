import { Type } from '@sinclair/typebox';
import { FileDto, ListFileDto } from '@dtos/in';
import { FileResultDto, MetadataFileHostNameDto } from '@dtos/out';
import { fileHandler } from '@handlers';
import { verifyToken } from '@hooks';
import { createRoutes } from '@utils';

export const filePlugin = createRoutes('File', [
    {
        method: 'POST',
        url: '/file',
        onRequest: verifyToken,
        schema: {
            body: FileDto,
            response: {
                200: FileResultDto
            }
        },
        handler: fileHandler.uploadMetadataFile
    },
    {
        method: 'GET',
        url: '/file',
        onRequest: verifyToken,
        schema: {
            querystring: { fname: Type.String() },
            response: {
                200: Type.Array(Type.String())
            }
        },
        handler: fileHandler.listHostName
    },
    {
        method: 'POST',
        url: '/listFiles',
        onRequest: verifyToken,
        schema: {
            body: ListFileDto,
            response: {
                200: Type.Number()
            }
        },
        handler: fileHandler.uploadListMetadatFile
    },
    {
        method: 'GET',
        url: '/listFiles/:hostName',
        schema: {
            params: { hostName: Type.String() },
            response: {
                200: Type.Array(MetadataFileHostNameDto)
            }
        },
        handler: fileHandler.discoverHostName
    }
]);
