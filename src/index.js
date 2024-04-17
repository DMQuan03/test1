const express = require('express');
const app = express();
const cors = require('cors');
const socket = require('socket.io');

require('dotenv').config();
const PORT = 5678;
app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
});

const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true,
        methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('command', (data) => {
        console.log(data);
        socket.broadcast.emit('server_send_command', data);
    });

    socket.on('disconnect', async () => {
        console.log('user ip disconnected' + socket.ip);
    });
});
