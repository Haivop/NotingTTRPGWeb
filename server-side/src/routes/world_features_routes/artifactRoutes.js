import { Router } from "express";
const artifact = Router({ mergeParams: true });

artifact.route("/:artifactId")
    .get((req, res) => {
        res.send(`Artifact ${req.params.artifactId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {res.send(`Artifact ${req.params.artifactId} posted`)})
    .delete((req, res) => {});

artifact.route("/:artifactId/edit")
    .get((req, res) => {})
    .post((req, res) => {})
    .delete((req, res) => {});

artifact.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

export default artifact;