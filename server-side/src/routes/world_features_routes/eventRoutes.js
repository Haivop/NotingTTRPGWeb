import { Router } from "express";
const event = Router({ mergeParams: true });

event.route("/:eventId")
    .get((req, res) => {
        res.send(`Event ${req.params.characterId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {});

event.route("/:eventId/edit")
    .get((req, res) => {})
    .post((req, res) => {})
    .delete((req, res) => {});

event.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

export default event;