import { Static, Type } from '@sinclair/typebox';
import { ObjectId } from '@dtos/common';

export const FileDto = Type.Object({
    name: Type.String(),
    type: Type.String(),
    size: Type.Number(),
    sessionId: ObjectId
});

export type FileDto = Static<typeof FileDto>;
