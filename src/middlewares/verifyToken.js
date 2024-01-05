import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
            if (err) return res.status(403).json('Token is not valid!');
            req.user = user;
            console.log('req: ' + req) ;
            next();
        });
    } else {
        res.status(401).json('You are not authenticated!');
    }
};
