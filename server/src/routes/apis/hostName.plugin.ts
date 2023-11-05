import { Type } from '@sinclair/typebox';
import { hostNameHandler } from '@handlers';
import { createRoutes } from '@utils';

export const hostNamePlugin = createRoutes('HostName', [
    {
        method: 'GET',
        url: '',
        schema: {
            response: {
                200: Type.Array(Type.String())
            }
        },
        handler: hostNameHandler.getAllHostNames
    }
]);
