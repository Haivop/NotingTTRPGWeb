import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const quest = Router({ mergeParams: true });
const questModel = new GeneralModel(db_connection, "Quests").init();
const questController = new WorldItemsController(questModel);

quest.route("/:questId")
    .get(questController.itemPage)
    .patch(checkAuth, questController.updateItem) // edit
    .delete(checkAuth, questController.deleteItem); // delete

quest.get("/:questId/edit", checkAuth, questController.edittingPage);

quest.get("/create", checkAuth, questController.creationPage);
quest.post("/create", checkAuth, questController.createItem);

export default quest;