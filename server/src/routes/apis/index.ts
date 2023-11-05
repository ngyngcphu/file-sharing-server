import { FastifyInstance } from 'fastify';
import { userPlugin } from './user.plugin';
import { filePlugin } from './file.plugin';
import { hostNamePlugin } from './hostName.plugin';

export async function apiPlugin(app: FastifyInstance) {
    app.register(userPlugin, { prefix: '/user' });
    app.register(filePlugin, { prefix: '' });
    app.register(hostNamePlugin, { prefix: '/hostName' });
}
