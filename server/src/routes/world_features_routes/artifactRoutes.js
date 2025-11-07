const express = require("express");
const artifact = express.Router({ mergeParams: true });

artifact.route("/:artifactId")
    .get((req, res) => {
        res.send(`Artifact ${req.params.artifactId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {res.send(`Artifact ${req.params.artifactId} posted`)})
    .delete((req, res) => {});

artifact.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

module.exports = artifact;