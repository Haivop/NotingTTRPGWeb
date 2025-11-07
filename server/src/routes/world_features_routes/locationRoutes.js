const express = require("express");
const location = express.Router({ mergeParams: true });

location.route("/:locationId")
    .get((req, res) => {
        res.send(`Location ${req.params.locationId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {});

location.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

module.exports = location;