import { Static, Type } from '@sinclair/typebox';

export const MetadataFileHostNameDto = Type.Object({
    name: Type.String(),
    type: Type.String(),
    size: Type.Number(),
    sharedTime: Type.Number(),
    isAvailable: Type.Boolean()
});

export type MetadataFileHostNameDto = Static<typeof MetadataFileHostNameDto>;
