import { Static, Type } from '@sinclair/typebox';

export const FileDto = Type.Object({
    name: Type.String(),
    type: Type.String(),
    size: Type.Integer(),
    sharedTime: Type.Date(),
    isAvailable: Type.Boolean()
});

export type FileDto = Static<typeof FileDto>;
