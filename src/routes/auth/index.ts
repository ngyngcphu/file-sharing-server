import { Type } from '@sinclair/typebox';
import { LoginDto, SignupDto, LogoutDto } from '@dtos/in';
import { LoginResultDto, SignupResultDto } from '@dtos/out';
import { authHandler } from '@handlers';
import { createRoutes } from '@utils';

export const authPlugin = createRoutes('Auth', [
    {
        method: 'POST',
        url: '/login',
        schema: {
            body: LoginDto,
            response: {
                200: LoginResultDto
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
                200: SignupResultDto
            }
        },
        handler: authHandler.signup
    },
    {
        method: 'POST',
        url: '/logout',
        schema: {
            body: LogoutDto,
            response: {
                200: Type.String()
            }
        },
        handler: authHandler.logout
    }
]);
