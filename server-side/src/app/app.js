import express, { json, urlencoded } from "express";
import { json as _json } from 'body-parser';
import cors from "cors";

import world from "../routes/worldRoutes";
import user from "../routes/userRoutes";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(_json());
app.use(cors());

app.use("/world", world);
app.use("/user", user);

app.get("/", (req, res) => {
    res.send("Hub!");
});

app.get("/search", (req, res) => {
    res.send("Search page!");
});

export default app;