import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth, isCoAuthorOrOwner } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const faction = Router({ mergeParams: true });
const factionModel = new GeneralModel(db_connection, "Factions");
factionModel.init();
export const factionController = new WorldItemsController(factionModel);

faction.get("/:factionId/edit", /*checkAuth, isCoAuthorOrOwner,*/ factionController.edittingPage.bind(factionController));

faction.get("/create", /*checkAuth, isCoAuthorOrOwner,*/ factionController.creationPage.bind(factionController));
faction.post("/create", /*checkAuth, isCoAuthorOrOwner,*/ factionController.createItem.bind(factionController));

faction.route("/:factionId")
    .get(factionController.itemPage.bind(factionController).bind(factionController))
    .patch(/*checkAuth, isCoAuthorOrOwner,*/ factionController.updateItem.bind(factionController)) // edit
    .delete(/*checkAuth, isCoAuthorOrOwner,*/ factionController.deleteItem.bind(factionController)); // delete

export default faction;