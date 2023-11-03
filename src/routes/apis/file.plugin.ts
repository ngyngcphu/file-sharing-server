import { Type } from '@sinclair/typebox';
import { fileHandler } from '@handlers';
import { createRoutes } from '@utils';

export const filePlugin = createRoutes('File', [
    {
        method: 'POST',
        url: '',
        schema: {
            response: {
                200: Type.String()
            }
        },
        handler: fileHandler.uploadMetadataFile
    }
]);
