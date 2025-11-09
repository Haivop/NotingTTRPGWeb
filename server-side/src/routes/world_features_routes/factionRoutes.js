import { Router } from "express";
import { FactionModel } from "../../model/world_features_models/factionModel.js";
import { checkAuth } from "../../middleware/authMiddleware.js";

const faction = Router({ mergeParams: true });

faction.route("/:factionId")
    .get((req, res) => {
        const { worldId, factionId } = req.params
        res.status(200).json({
            itemType: `Faction`,
            item: FactionModel.getById(factionId, worldId)
        });
    })
    .patch(checkAuth, (req, res) => {
        const { worldId, factionId } = req.params;
        const newData = {location_id, title, motto, description} = req.body;

        FactionModel.update(factionId, newData);

        res.status(200).json({
            message: "faction data upadated",
            updatedData : FactionModel.getById(factionId, worldId)
        });
    }) // edit
    .delete(checkAuth, (req, res) => {
        FactionModel.delete(req.params.factionId);
        res.status(200).json({
            message: "faction deleted"
        });
    }); // delete

faction.get("/:factionId/edit", checkAuth, (req, res) => {
    const { worldId, factionId } = req.params;
    res.status(200).json({
        message: "faction edit page",
        item: FactionModel.getById(factionId, worldId)
    });
});

faction.get("/create", checkAuth, (req, res) => {
    res.status(200).json({
        message: "faction creation page"
    });
});
faction.post("/create", checkAuth, (req, res) => {
    const factionData = {location_id, title, motto, description} = req.body;
    factionData.world_id = { worldId } = req.params;

    FactionModel.create(factionData);
    res.status(201).json({
        massage: "faction created",
        created: factionData
    });
});

export default faction;