import { Static, Type } from '@sinclair/typebox';
import { ObjectId } from '@dtos/common';

export const FileDto = Type.Object({
    name: Type.String(),
    type: Type.String(),
    size: Type.Number(),
    sessionId: ObjectId
});
export type FileDto = Static<typeof FileDto>;

export const ListFileDto = Type.Object({
    sessionId: ObjectId,
    listFileMetadata: Type.Array(
        Type.Object({
            name: Type.String(),
            type: Type.String(),
            size: Type.Number()
        })
    )
});
export type ListFileDto = Static<typeof ListFileDto>;
