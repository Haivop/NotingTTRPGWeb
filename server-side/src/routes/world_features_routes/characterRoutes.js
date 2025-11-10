import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";;

const character = Router({ mergeParams: true });
const characterModel = new GeneralModel(db_connection, "Characters").init();
const characterController = new WorldItemsController(characterModel);

character.route("/:characterId")
    .get(characterController.itemPage)
    .patch(checkAuth, characterController.updateItem) // edit
    .delete(checkAuth, characterController.deleteItem); // delete

character.get("/:characterId/edit", checkAuth, characterController.edittingPage);

character.get("/create", checkAuth, characterController.creationPage);
character.post("/create", checkAuth, characterController.createItem);

export default character;