import express from "express";
import bodyParser from 'body-parser';
import cors from "cors";

import world from "../routes/worldRoutes.js";
import user from "../routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.param(['artifactId', 'characterId', 'eventId', 'factionId', 'locationId', 'questId'], (req, res, next, value) => {
    req.params.id = value;
    console.log(req.params.id, value);
    next();
})

app.use("/world", world);
app.use("/user", user);

app.get("/", (req, res) => {
    res.send("Hub!");
});

app.get("/search", (req, res) => {
    res.send("Search page!");
});

app.use((req, res, next) => {
    const error = new Error("404 - Not found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
    next();
})

export default app;