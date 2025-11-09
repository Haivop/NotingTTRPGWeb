import jwt from "jsonwebtoken";
import { loadEnvFile } from 'node:process';

loadEnvFile("./config/.env");
    
export function checkAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if(!authHeader){return res.status(401).json({ message: 'Authorization header missing' })}

    const token = authHeader.split(" ")[1];
    if (!token) { return res.status(401).json({ message: 'Token missing' })};

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
        res.redirect("/user/login", 403);
    }
}

export function isOwner(){
    
}

export function isCoAuthor(){
    
}