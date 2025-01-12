//server side 

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server, {
    cors: {
        origin: "http://127.0.0.1:5500",  // Allow requests from this origin
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("New user joined:", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);  // server sending name of client to all other clients

        socket.emit('welcome', `Welcome to the chat, "   ${name}  " !`);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left',{ name : users[socket.id]});
        delete users[socket.id];
    });
});

server.listen(8000, () => {
    console.log('Socket.IO server running on http://localhost:8000');
});
