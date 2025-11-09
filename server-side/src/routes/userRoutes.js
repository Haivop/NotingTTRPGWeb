import { Router } from "express";

import { checkAuth } from "../middleware/authMiddleware.js";
import { loginUser, signUpHandler } from "../controller/userController.js"; 
    
const user = Router({ mergeParams: true });

user.route("/login")
    .get((req, res) => { res.send("Login page!"); })
    .post(loginUser);

user.route("/signup")
    .get((req, res) => { res.send("Sign Up page!"); })
    .post(signUpHandler);

user.get("/account", checkAuth, (req, res) => { 
    res.json({ 
        massage: `Account page!`, 
        user: req.user
    }); 
});

export default user;