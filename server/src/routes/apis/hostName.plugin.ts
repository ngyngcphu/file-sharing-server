import { Type } from '@sinclair/typebox';
import { hostNameHandler } from '@handlers';
import { createRoutes } from '@utils';

export const hostNamePlugin = createRoutes('HostName', [
    {
        method: 'GET',
        url: '/hostName',
        schema: {
            response: {
                200: Type.Array(Type.String())
            }
        },
        handler: hostNameHandler.getAllHostNames
    },
    {
        method: 'GET',
        url: '/ip/:hostName',
        schema: {
            params: { hostName: Type.String() },
            response: {
                200: Type.String()
            }
        },
        handler: hostNameHandler.transferHostNameToIP
    }
]);
