import jwt from "jsonwebtoken";

import { UserModel } from "../model/userModel.js";

export class UserController {
    static async signUpHandler (req, res) {
        const {username, email, password} = req.body;
        
        if (!(username && password)){
            const error = new Error("Empty input fields!");
            next(error);
        }

        res.status(201).json({
            massage: "Handling POST request to /signup",
            signUpedUser: {username, email, password}
        });

        UserModel.create({username, email, password});
    };

    static async loginUser (req, res) {
        const {username, password} = req.body;
        const users = await UserModel.getAll();
        const user = users.find((u) => ((u.username === username || u.email === username) && u.password_hash === password));
        if (!user){ return res.status(401).json({ massage: "Invalid credentials!" }); };
        
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        res.json({ massage: "Login successful", token});
    };

    static async accountPage (req, res) { 
        res.json({ 
            massage: `Account page!`, 
            user: req.user
        }); 
    };
}