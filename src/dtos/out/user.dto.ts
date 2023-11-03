import { ObjectId } from '@dtos/common';
import { Static, Type } from '@sinclair/typebox';

export const UserDto = Type.Object({
    userId: ObjectId,
    sessionId: ObjectId
});

export type UserDto = Static<typeof UserDto>;
