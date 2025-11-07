const express = require("express");
const event = express.Router({ mergeParams: true });

event.route("/:eventId")
    .get((req, res) => {
        res.send(`Event ${req.params.characterId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {});

event.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

module.exports = event;