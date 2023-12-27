import dotenv from 'dotenv';
import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
import connectDb from './src/configs/db.js';
import cors from 'cors';
import router from './src/routes/index.js';
// import http from 'http';
// import { Server } from 'socket.io';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
// const __filePath = fileURLToPath(import.meta.url);
// const __dirName = path.dirname(__filePath);

// Connect database
connectDb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/static', express.static(path.join(__dirName, 'uploads')));

// Routes init
app.use('/api/v1', router);
// app.get('/', (req, res) => {
//     res.send('This is a response from server');
// });

// Socket io
// ...

app.listen(port, () => {
    console.log('Server is running at port ' + port);
});
