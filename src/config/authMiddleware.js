import jwt from 'jsonwebtoken';

import dotenv from 'dotenv'

dotenv.config()

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Não autorizado.' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        req.userId = decoded.id;
        req.username = decoded.username;
        return next();
    }catch (err) {
        return res.status(401).json({ error: 'Não autorizado' });
    }
}