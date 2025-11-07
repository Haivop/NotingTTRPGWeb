import { Router } from "express";
const quest = Router({ mergeParams: true });

quest.route("/:questId")
    .get((req, res) => {
    res.send(`Quest ${req.params.questId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {})
    .delete((req, res) => {})

quest.route("/:questId/edit")
    .get((req, res) => {})
    .post((req, res) => {})
    .delete((req, res) => {});

quest.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

export default quest;