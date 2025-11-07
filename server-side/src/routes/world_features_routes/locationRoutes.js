import { Router } from "express";
const location = Router({ mergeParams: true });

location.route("/:locationId")
    .get((req, res) => {
        res.send(`Location ${req.params.locationId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {});

location.route("/:locationId/edit")
    .get((req, res) => {})
    .post((req, res) => {})
    .delete((req, res) => {});

location.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

export default location;