import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth, isCoAuthorOrOwner } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const faction = Router({ mergeParams: true });
const factionModel = new GeneralModel(db_connection, "Factions").init();
const factionController = new WorldItemsController(factionModel);

faction.route("/:factionId")
    .get(factionController.itemPage)
    .patch(checkAuth, isCoAuthorOrOwner, factionController.updateItem) // edit
    .delete(checkAuth, isCoAuthorOrOwner, factionController.deleteItem); // delete

faction.get("/:factionId/edit", checkAuth, isCoAuthorOrOwner, factionController.edittingPage);

faction.get("/create", checkAuth, isCoAuthorOrOwner, factionController.creationPage);
faction.post("/create", checkAuth, isCoAuthorOrOwner, factionController.createItem);

export default faction;