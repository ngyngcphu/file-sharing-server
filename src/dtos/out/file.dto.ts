import { Static, Type } from '@sinclair/typebox';
import { ObjectId } from '@dtos/common';

export const FileDto = Type.Object({
    name: Type.String(),
    type: Type.String(),
    size: Type.Integer(),
    sharedTime: Type.Date(),
    sessionId: ObjectId
});

export type FileDto = Static<typeof FileDto>;
