import { Static, Type } from '@sinclair/typebox';
import { ObjectId } from '@dtos/common';

export const FileResultDto = Type.Object({
    fileId: ObjectId
});

export type FileResultDto = Static<typeof FileResultDto>;
