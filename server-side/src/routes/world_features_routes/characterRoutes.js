import { Router } from "express";
const character = Router({ mergeParams: true });

character.route("/:characterId")
    .get((req, res) => {
        res.send(`Character ${req.params.characterId} page in ${req.params.worldId} world!`);
    })
    .post((req, res) => {})
    .patch((req, res) => {})
    .delete((req, res) => {});

character.get("/:characterId/edit", (req, res) => {});
character.get("/create", (req, res) => {});

export default character;