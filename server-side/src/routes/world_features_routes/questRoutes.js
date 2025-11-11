import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth, isCoAuthorOrOwner } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const quest = Router({ mergeParams: true });
const questModel = new GeneralModel(db_connection, "Quests");
questModel.init();
export const questController = new WorldItemsController(questModel);

quest.get("/:questId/edit", /*checkAuth, isCoAuthorOrOwner,*/ questController.edittingPage.bind(questController));

quest.get("/create", /*checkAuth, isCoAuthorOrOwner,*/ questController.creationPage.bind(questController));
quest.post("/create", /*checkAuth, isCoAuthorOrOwner,*/ questController.createItem.bind(questController));

quest.route("/:questId")
    .get(questController.itemPage.bind(questController))
    .patch(/*checkAuth, isCoAuthorOrOwner,*/ questController.updateItem.bind(questController)) // edit
    .delete(/*checkAuth, isCoAuthorOrOwner,*/ questController.deleteItem.bind(questController)); // delete

export default quest;