import { Router } from "express";
const event = Router({ mergeParams: true });

event.route("/:eventId")
    .get((req, res) => {
        res.send(`Event ${req.params.characterId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {})
    .patch((req, res) => {})
    .delete((req, res) => {});

event.get("/:eventId/edit", (req, res) => {});
event.get("/create", (req, res) => {});

export default event;