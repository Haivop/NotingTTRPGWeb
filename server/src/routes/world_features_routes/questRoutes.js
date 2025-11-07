const express = require("express");
const quest = express.Router({ mergeParams: true });

quest.route("/:questId")
    .get((req, res) => {
    res.send(`Quest ${req.params.questId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {})
    .delete((req, res) => {})

quest.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

module.exports = quest;