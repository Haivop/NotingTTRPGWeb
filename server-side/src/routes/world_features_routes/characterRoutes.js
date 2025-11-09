import { Router } from "express";
import { CharacterModel } from "../../model/world_features_models/characterModel.js";
import { checkAuth } from "../../middleware/authMiddleware.js";

const character = Router({ mergeParams: true });

character.route("/:characterId")
    .get((req, res) => {
        const { worldId, characterId } = req.params
        res.status(200).json({
            itemType: `Character`,
            item: CharacterModel.getById(characterId, worldId)
        });
    })
    .patch(checkAuth, (req, res) => {
        const { worldId, characterId } = req.params;
        const newData = {faction_id, character_name, role, description} = req.body;

        CharacterModel.update(characterId, newData);

        res.status(200).json({
            message: "character data upadated",
            updatedData : CharacterModel.getById(characterId, worldId)
        });
    })
    .delete(checkAuth, (req, res) => {
        CharacterModel.delete(req.params.characterId);
        res.status(200).json({
            message: "character deleted"
        });
    });

character.get("/:characterId/edit", checkAuth, (req, res) => {
    const { worldId, characterId } = req.params;
    res.status(200).json({
        message: "Character edit page",
        item: CharacterModel.getById(characterId, worldId)
    });
});

character.get("/create", checkAuth, (req, res) => {
    res.status(200).json({
        message: "Artifact creation page"
    });
});
character.post("/create", checkAuth, (req, res) => {
    const characterData = {faction_id, character_name, role, description} = req.body;
    characterData.world_id = { worldId } = req.params;

    CharacterModel.create(characterData);
    res.status(201).json({
        message: "Character created",
        created: characterData
    });
});

export default character;