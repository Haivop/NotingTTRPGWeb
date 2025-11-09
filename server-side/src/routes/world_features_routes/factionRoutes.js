import { Router } from "express";
const faction = Router({ mergeParams: true });

faction.route("/:factionId")
    .get((req, res) => {
        res.send(`Faction ${req.params.factionId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {})
    .patch((req, res) => {})
    .delete((req, res) => {});

faction.get("/:factionId/edit", (req, res) => {});
faction.get("/create", (req, res) => {});

export default faction;