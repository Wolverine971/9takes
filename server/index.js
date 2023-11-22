import { createServer } from 'http';
import express from 'express';
import injectSocketIO from '../src/utils/socket.js';

import { handler } from '../build/handler.js';

const port = 3000;
const app = express();
const server = createServer(app);

// Inject SocketIO
injectSocketIO(server);

// SvelteKit handlers
app.use(handler);
console.log('SvelteKit injected');

server.listen(port, () => {
	console.log(`Running on http://localhost:${port}`);
});
