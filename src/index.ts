import { createServer } from './Server';

const PORT = 8000;

// DO NOT modify, it is used to resolve port mapping when deploy.
const HOST = '0.0.0.0';

// Setup and start fastify server
const app = createServer({
    host: HOST,
    port: PORT
});

app.start();
