const express = require("express");
const user = express.Router({ mergeParams: true });

user.get("/login", (req, res) => {
    res.send("Login page!");
});

user.get("/signup", (req, res) => {
    res.send("Sign Up page!");
});

user.get("/account", (req, res) => {
    res.send("Account page!");
});

module.exports = user;