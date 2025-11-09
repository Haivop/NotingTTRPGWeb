import { User } from "../model/userModel.js";

export const signUpHandler = (req, res) => {
    const {username, email, password} = req.body;
    
    if (!(username && password)){
        const error = new Error("Empty input fields!");
        next(error);
    }

    res.status(201).json({
        massage: "Handling POST request to /signup",
        signUpedUser: {
            username: username,
            email: email,
            password: password
        }
    });

    User.create({username, email, password});
};

export function loginUser (req, res) {
    const {username, password} = req.body;
    const user = User.getAllUsers().find((u) => (u.username === username || u.email === username) && u.password === password );
    if (!user){ return res.status(401).json({ massage: "Invalid credentials!" }); };
    
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    res.json({ massage: "Login successful", token});
    res.redirect("/");
};