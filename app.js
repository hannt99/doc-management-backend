import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
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

let connectingUsers = [];

const addConnectingUser = (userId, socketId) => {
    !connectingUsers.some((user) => user.userId === userId) && connectingUsers.push({ userId, socketId });
};

const removeConnectingUser = (socketId) => {
    connectingUsers = connectingUsers.filter((user) => user.socketId !== socketId);
};

export const sendNotification = (notiText, notiLinkTask, notiReceiverId, notiId) => {
    const assignToUsers = connectingUsers?.filter((user) => notiReceiverId?.find((it) => it === user?.userId));

    assignToUsers?.map((user) => {
        return io.to(user?.socketId).emit('getNotification', {
            senderId: '',
            text: notiText,
            linkTask: notiLinkTask,
            receiverId: user.userId,
            isRead: false,
            _id: notiId,
        });
    });
};

io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`);

    socket.on('addUser', (userId) => {
        addConnectingUser(userId, socket.id);
        io.emit('getUsers', connectingUsers);
    });

    socket.on('sendNotification', ({ senderId, text, linkTask, receiverId, isRead, _id }) => {
        const assignToUsers = connectingUsers?.filter((item) => receiverId?.find((it) => it === item?.userId));
        assignToUsers?.map((user) => {
            return io.to(user?.socketId).emit('getNotification', {
                senderId,
                text,
                linkTask,
                receiverId: user.userId,
                isRead,
                _id,
            });
        });
    });

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected!`);
        removeConnectingUser(socket.id);
        io.emit('getUsers', connectingUsers);
    });
});

server.listen(port, () => {
    console.log('Server is running at port ' + port);
});
