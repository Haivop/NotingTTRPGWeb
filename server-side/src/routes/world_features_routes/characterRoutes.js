import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth, isCoAuthorOrOwner } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";;

const character = Router({ mergeParams: true });
const characterModel = new GeneralModel(db_connection, "Characters").init();
const characterController = new WorldItemsController(characterModel);

character.route("/:characterId")
    .get(characterController.itemPage)
    .patch(checkAuth, isCoAuthorOrOwner, characterController.updateItem) // edit
    .delete(checkAuth, isCoAuthorOrOwner, characterController.deleteItem); // delete

character.get("/:characterId/edit", checkAuth, isCoAuthorOrOwner, characterController.edittingPage);

character.get("/create", checkAuth, isCoAuthorOrOwner, characterController.creationPage);
character.post("/create", checkAuth, isCoAuthorOrOwner, characterController.createItem);

export default character;