import type { ViteDevServer } from 'vite';
import { Server } from 'socket.io';

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) {
			console.log('No http server found');

			return;
		}
		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			socket.emit('eventFromServer', 'Hello, World 👋');

			socket.on('eventFromClient', (anotherSocketId, msg) => {
				console.log('eventFromClient', anotherSocketId, msg);
				socket.emit('eventFromServer', 'got a message');
			});
		});
	}
};
