const express = require("express");
const faction = express.Router({ mergeParams: true });

faction.route("/:worldId/faction/:factionId")
    .get((req, res) => {
        res.send(`Faction ${req.params.factionId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {});

faction.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

module.exports = faction;