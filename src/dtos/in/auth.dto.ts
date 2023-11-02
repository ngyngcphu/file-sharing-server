import { Static, Type } from '@sinclair/typebox';
import { MIN_USERNAME_LENGTH, MIN_PASSWORD_LENGTH } from '@constants';
import { ObjectId } from '@dtos/common';

// See https://github.com/sinclairzx81/typebox

export const LoginDto = Type.Object({
    username: Type.String({ minLength: MIN_USERNAME_LENGTH }),
    password: Type.String({ minLength: MIN_PASSWORD_LENGTH })
});
export type LoginDto = Static<typeof LoginDto>;

export const SignupDto = Type.Object({
    username: Type.String({ minLength: MIN_USERNAME_LENGTH }),
    password: Type.String({ minLength: MIN_PASSWORD_LENGTH }),
    fullName: Type.String()
});
export type SignupDto = Static<typeof SignupDto>;

export const LogoutDto = Type.Object({
    id: ObjectId
});
export type LogoutDto = Static<typeof LogoutDto>;
