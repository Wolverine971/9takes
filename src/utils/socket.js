import { Server } from 'socket.io';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function injectSocketIO(server) {
    const io = new Server(server);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    io.on('connection', (socket) => {

        socket.emit('eventFromServer', 'Hello, World 👋')

        socket.on("eventFromClient", (msg, meta) => {
            const { to } = meta
            console.log('eventFromClient', msg, meta)
            socket.broadcast.emit(to, msg, meta);
        });



        socket.on("clientBroadCastEvent", (msg, meta) => {
            const { to } = meta
            console.log('clientBroadCastEvent', msg, meta)
            socket.broadcast.emit(to, msg, meta);
        });
    });

    console.log('SocketIO injected');
}