import { FileDto } from '@dtos/in';
import { FileResultDto } from '@dtos/out';
import { fileHandler } from '@handlers';
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
    }
]);
