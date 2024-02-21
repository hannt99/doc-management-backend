import jwt from 'jsonwebtoken';
import customLog from '../utils/customLog.js';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // customLog(req.headers);
    // customLog(req.body);
    // customLog(req);
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
            if (err) return res.status(403).json('Token is not valid!');
            req.user = user;
            next();
        });
    } else {
        // console.log('You are not authenticated!');
        res.status(401).json('You are not authenticated!');
    }
};
