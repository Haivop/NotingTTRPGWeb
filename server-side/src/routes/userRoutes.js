import { Router } from "express";

import { loginUser, checkAuth } from "../middleware/authMiddleware.js";
import { signUpHandler } from "../controller/userController.js"; 
    
const user = Router({ mergeParams: true });

user.route("/login")
    .get((req, res) => { res.send("Login page!");})
    .post(loginUser);

user.route("/signup")
    .get((req, res) => { res.send("Sign Up page!") })
    .post(signUpHandler);

user.get("/account", checkAuth, (req, res) => { res.send("Account page!"); });

export default user;