import { trackerServer, invoke } from '@services';

export const hostNameService = {
    getAll: () => invoke<string[]>(trackerServer.get('/api/hostName')),
    discover: (hostName: string) => invoke<FileMetadata[]>(trackerServer.get(`/api/listFiles/${hostName}`)),
    transfer: (hostName: string) => invoke<string>(trackerServer.get(`/api/ip/${hostName}`))
};