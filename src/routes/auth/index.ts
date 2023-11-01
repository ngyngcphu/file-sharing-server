import { Type } from '@sinclair/typebox';
import { LoginDto, SignupDto } from '@dtos/in';
import { AuthResultDto } from '@dtos/out';
import { authHandler } from '@handlers';
import { createRoutes } from '@utils';

export const authPlugin = createRoutes('Auth', [
    {
        method: 'POST',
        url: '/login',
        schema: {
            body: LoginDto,
            response: {
                200: AuthResultDto
            }
        },
        handler: authHandler.login
    },
    {
        method: 'POST',
        url: '/signup',
        schema: {
            body: SignupDto,
            response: {
                200: AuthResultDto
            }
        },
        handler: authHandler.signup
    },
    {
        method: 'POST',
        url: '/logout',
        schema: {
            response: {
                200: Type.String()
            }
        },
        handler: authHandler.logout
    }
]);