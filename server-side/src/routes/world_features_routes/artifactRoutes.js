import { Router } from "express";
const artifact = Router({ mergeParams: true });

artifact.route("/:artifactId")
    .get((req, res) => {
        res.send(`Artifact ${req.params.artifactId} page in ${req.params.worldId} world!`);
    }) // view page
    .post((req, res) => {}) // create
    .patch((req, res) => {}) // edit
    .delete((req, res) => {}); // delete

artifact.get("/:artifactId/edit", (req, res) => {}); // view edit page
artifact.get("/create", (req, res) => {}); // view create page

export default artifact;