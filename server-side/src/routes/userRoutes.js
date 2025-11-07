import { Router } from "express";
import { join } from "path";

import { loginUser, authenticateJWT } from "../middleware/authMiddleware";
import {} from "../controller/userController"; 
    
const user = Router({ mergeParams: true });

user.route("/login")
    .get((req, res) => {
        res.sendFile(join(__dirname, 'view', 'view-post-stub.html'));
    })
    .post(loginUser);

user.route("/signup")
    .get((req, res) => { res.send("Sign Up page!")})
    .post((req, res) => {});

user.get("/account", authenticateJWT, (req, res) => {
    res.send("Account page!");
});

export default user;