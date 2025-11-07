import { sign, verify } from "jsonwebtoken";
import { loadEnvFile } from 'node:process';
loadEnvFile("./config/.env");

process.env.JWT_SECRET_KEY;

users_sample = [{ id: "1", username: "haivop", password: "pass123", role: "user"}];

export function loginUser(req, res) {
    const {username, password} = req.body;

    const user = users_sample.find((u) => u.username === username && u.password === password);

    if (!user){ return res.status(401).json({massage: "Invalid credentials!"});};
    
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role
    };

    const token = sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    res.json({ massage: "Login successful", token});
}

export function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if(!authHeader){return res.status(401).json({ message: 'Authorization header missing' })}

    const token = authHeader.split(" ")[1];
    if (!token) { return res.status(401).json({ message: 'Token missing' })};

    try {
        const decoded = verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
        res.redirect("/user/login", 403);
    }
}