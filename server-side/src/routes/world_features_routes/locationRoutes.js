import { Router } from "express";
const location = Router({ mergeParams: true });

location.route("/:locationId")
    .get((req, res) => {
        res.send(`Location ${req.params.locationId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {})
    .patch((req, res) => {})
    .delete((req, res) => {});

location.get("/:locationId/edit", (req, res) => {});
location.get("/create", (req, res) => {});

export default location;