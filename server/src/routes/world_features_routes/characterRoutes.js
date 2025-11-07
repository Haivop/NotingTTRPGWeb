const express = require("express");
const character = express.Router({ mergeParams: true });

character.route("/:characterId")
    .get((req, res) => {
        res.send(`Character ${req.params.characterId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {});

character.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

module.exports = character;