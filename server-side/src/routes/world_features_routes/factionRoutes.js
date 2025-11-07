import { Router } from "express";
const faction = Router({ mergeParams: true });

faction.route("/:factionId")
    .get((req, res) => {
        res.send(`Faction ${req.params.factionId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {});
    
faction.route("/:factionId/edit")
    .get((req, res) => {})
    .post((req, res) => {})
    .delete((req, res) => {});

faction.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

export default faction;