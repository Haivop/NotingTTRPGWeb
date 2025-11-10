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
    .patch(checkAuth, isCoAuthorOrOwner, questController.updateItem) // edit
    .delete(checkAuth, isCoAuthorOrOwner, questController.deleteItem); // delete

quest.get("/:questId/edit", checkAuth, isCoAuthorOrOwner, questController.edittingPage);

quest.get("/create", checkAuth, isCoAuthorOrOwner, questController.creationPage);
quest.post("/create", checkAuth, isCoAuthorOrOwner, questController.createItem);

export default quest;