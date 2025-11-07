const express = require("express");
const app = express();
const cors = require("cors");
const world = require("../routes/worldRoutes");
const user = require("../routes/userRoutes");

app.use(cors());
app.use("/world", world);
app.use("/user", user);

app.get("/", (req, res) => {
    res.send("Hub!");
});

app.get("/search", (req, res) => {
    res.send("Search page!");
});

app.all('*', (req, res) => {
  res.status(404).send('404 - Page not found');
});

module.exports = app;