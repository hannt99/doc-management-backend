import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDb from './src/configs/db.js';
import cors from 'cors';
import router from './src/routes/index.js';
import http from 'http';
import { Server } from 'socket.io';
import customLog from './src/utils/customLog.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const __filePath = fileURLToPath(import.meta.url);
// customLog(import.meta.url);
// console.log(typeof import.meta.url);
// customLog(__filePath);
// console.log(typeof __filePath);
const __dirName = path.dirname(__filePath);
// customLog(__dirName);

// Connect database
connectDb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirName, 'uploads')));

// Routes init
app.use('/api/v1', router);
// app.get('/', (req, res) => {
//     res.send('This is a response from server');
// });

// Socket io
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // origin: process.env.REACT_APP_BASE_URL,
        origin: '*',
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

export const sendNotification = (notiId, notiText, notiLinkTask, notiReceiverId) => {
    const assignToUsers = users?.filter((item) => notiReceiverId?.find((it) => it === item?.userId));
    assignToUsers?.map((user) => {
        return io.to(user?.socketId).emit('getNotification', {
            senderId: '',
            _id: notiId,
            text: notiText,
            linkTask: notiLinkTask,
            isRead: false,
            receiverId: user.userId,
        });
    });
};

io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`);

    socket.on('addUser', (userId) => {
        addUser(userId, socket.id);
        io.emit('getUsers', users);
    });

    socket.on('sendNotification', ({ senderId, _id, text, linkTask, isRead, receiverId }) => {
        const assignToUsers = users?.filter((item) => receiverId?.find((it) => it === item?.userId));
        assignToUsers?.map((user) => {
            return io.to(user?.socketId).emit('getNotification', {
                senderId,
                _id,
                text,
                linkTask,
                isRead,
                receiverId: user.userId,
            });
        });
    });

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected!`);
        removeUser(socket.id);
        io.emit('getUsers', users);
    });
});

server.listen(port, () => {
    console.log('Server is running at port ' + port);
});
