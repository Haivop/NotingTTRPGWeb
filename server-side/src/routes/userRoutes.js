import { Router } from "express";

import { checkAuth } from "../middleware/authMiddleware.js";
import { UserController } from "../controller/UserController.js"; 
    
const user = Router({ mergeParams: true });

user.route("/login")
    .get((req, res) => { res.send("Login page!"); })
    .post(UserController.loginUser);

user.route("/signup")
    .get((req, res) => { res.send("Sign Up page!"); })
    .post(UserController.signUpHandler);

user.get("/account", checkAuth, UserController.accountPage);

export default user;