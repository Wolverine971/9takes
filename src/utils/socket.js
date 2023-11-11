import { Server } from 'socket.io';

const dev = process.env.NODE_ENV === 'development'

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function injectSocketIO(server) {
    const io = new Server(server, {
        cors: {
         origin: dev ? "http://localhost:3000" : "https://9takes.com:3000", //specific origin you want to give access to,
     },
 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    io.on('connection', (socket) => {

        socket.emit('eventFromServer', 'Hello, World 👋')

        socket.on("eventFromClient", (msg, meta) => {
            const { to } = meta
            socket.broadcast.emit(to, msg, meta);
        });



        socket.on("clientBroadCastEvent", (msg, meta) => {
            const { to } = meta
            socket.broadcast.emit(to, msg, meta);
        });
    });

    console.log('SocketIO injected');
}