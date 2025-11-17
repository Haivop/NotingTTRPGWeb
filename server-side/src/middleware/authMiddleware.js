import jwt from "jsonwebtoken";
import { loadEnvFile } from 'node:process';
import { WorldModel } from "../model/WorldCRUDModel.js";

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
        res.status(403).json({ message: `Invalid or expired token; ${error} : ${token}`});
        res.redirect("/user/login", 403);
    }
}

export async function isOwner(req, res, next) {
    const user = req.user;
    const { worldId } = req.params;

    console.log(user);

    const ownerId = await WorldModel.getOwner(worldId).owner_id;

    if(user.id === ownerId) next();

    const error = new Error("You are not owner");
    error.status = 403;
    next(error);
}

export async function isCoAuthorOrOwner(req, res, next){
    const user = req.user;
    const { worldId } = req.params;
    const coAuthorsId = [];

    console.log(user);

    const {owner_id } = await WorldModel.getOwner(worldId);
    const coAuthors = await WorldModel.getCoAuthors(worldId);

    for(let coAuthor of coAuthors){
        coAuthorsId.push(coAuthor.id);
    }

    console.log(user.id, owner_id, (user.id === owner_id) || (coAuthorsId.includes(user.id)));

    if((user.id === owner_id) || (coAuthorsId.includes(user.id))) { 
        next();
    } else{
        const error = new Error("You are neither owner nor co-author");
        error.status = 403;
        next(error);
    };
}