import express from "express";
import bodyParser from 'body-parser';
import cors from "cors";

import world from "../routes/worldRoutes.js";
import user from "../routes/userRoutes.js";
import { search } from "../middleware/searchMiddleware.js";
import { WorldController } from "../controller/WorldController.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/world", world);
app.use("/user", user);

app.get("/", WorldController.hub);

app.get("/search", search);

app.use((req, res, next) => {
    const error = new Error("404 - Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
    next();
});

export default app;