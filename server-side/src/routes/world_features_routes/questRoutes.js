import { Router } from "express";
const quest = Router({ mergeParams: true });

quest.route("/:questId")
    .get((req, res) => {
    res.send(`Quest ${req.params.questId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {})
    .patch((req, res) => {})
    .delete((req, res) => {});

quest.get("/:questId/edit", (req, res) => {});
quest.get("/create", (req, res) => {});

export default quest;