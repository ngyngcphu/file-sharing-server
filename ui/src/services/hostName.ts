import { trackerServer, invoke } from '@services';

export const hostNameService = {
    getAll: () => invoke<string[]>(trackerServer.get('/api/hostName'))
};