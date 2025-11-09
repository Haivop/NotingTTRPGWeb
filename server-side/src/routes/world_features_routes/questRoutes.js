import { Router } from "express";
import { QuestModel } from "../../model/world_features_models/questModel.js";
import { checkAuth } from "../../middleware/authMiddleware.js";

const quest = Router({ mergeParams: true });

quest.route("/:questId")
    .get((req, res) => {
        const { worldId, questId } = req.params
        res.status(200).json({
            itemType: `Quest`,
            item: QuestModel.getById(questId, worldId)
        });
    })
    .patch(checkAuth, (req, res) => {
        const { worldId, questId } = req.params;
        const newData = { q_status, title, reward, objective, description } = req.body;

        QuestModel.update(questId, newData);

        res.status(200).json({
            message: "quest data upadated",
            updatedData : QuestModel.getById(questId, worldId)
        });
    }) // edit
    .delete(checkAuth, (req, res) => {
        QuestModel.delete(req.params.questId);
        res.status(200).json({
            message: "quest deleted"
        });
    }); // delete

quest.get("/:questId/edit", checkAuth, (req, res) => {
    const { worldId, questId } = req.params;
    res.status(200).json({
        message: "quest edit page",
        item: QuestModel.getById(questId, worldId)
    });
});

quest.get("/create", checkAuth, (req, res) => {
    res.status(200).json({
        message: "quest creation page"
    });
});
quest.post("/create", checkAuth, (req, res) => {
    const questData = { q_status, title, reward, objective, description } = req.body;
    questData.world_id = { worldId } = req.params;

    QuestModel.create(questData);
    res.status(201).json({
        massage: "quest created",
        created: questData
    });
});

export default quest;