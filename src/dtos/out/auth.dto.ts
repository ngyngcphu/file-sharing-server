import { ObjectId } from '@dtos/common';
import { Static, Type } from '@sinclair/typebox';

export const LoginResultDto = Type.Object({
    userId: ObjectId,
    sessionId: ObjectId
});
export type LoginResultDto = Static<typeof LoginResultDto>;

export const SignupResultDto = Type.Object({
    userId: ObjectId
});
export type SignupResultDto = Static<typeof SignupResultDto>;
