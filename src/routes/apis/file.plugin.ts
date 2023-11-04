import { FileDto } from '@dtos/in';
import { FileResultDto } from '@dtos/out';
import { fileHandler } from '@handlers';
import { Type } from '@sinclair/typebox';
import { createRoutes } from '@utils';

export const filePlugin = createRoutes('File', [
    {
        method: 'POST',
        url: '',
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
        url: '',
        schema: {
            querystring: { fname: Type.String() },
            response: {
                200: Type.Array(Type.String())
            }
        },
        handler: fileHandler.listHostName
    }
]);
