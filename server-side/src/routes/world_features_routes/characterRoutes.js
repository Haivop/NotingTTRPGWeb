import { Router } from "express";
const character = Router({ mergeParams: true });

character.route("/:characterId")
    .get((req, res) => {
        res.send(`Character ${req.params.characterId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {});

character.route("/:characterId/edit")
    .get((req, res) => {})
    .post((req, res) => {})
    .delete((req, res) => {});

character.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

export default character;