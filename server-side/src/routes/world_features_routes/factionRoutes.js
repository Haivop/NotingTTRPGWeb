import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const faction = Router({ mergeParams: true });
const factionModel = new GeneralModel(db_connection, "Factions").init();
const factionController = new WorldItemsController(factionModel);

faction.route("/:factionId")
    .get(factionController.itemPage)
    .patch(checkAuth, factionController.updateItem) // edit
    .delete(checkAuth, factionController.deleteItem); // delete

faction.get("/:factionId/edit", checkAuth, factionController.edittingPage);

faction.get("/create", checkAuth, factionController.creationPage);
faction.post("/create", checkAuth, factionController.createItem);

export default faction;