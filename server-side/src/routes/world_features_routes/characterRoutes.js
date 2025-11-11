import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth, isCoAuthorOrOwner } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";;

const character = Router({ mergeParams: true });
const characterModel = new GeneralModel(db_connection, "Characters");
characterModel.init();
export const characterController = new WorldItemsController(characterModel);

character.get("/:characterId/edit", /*checkAuth, isCoAuthorOrOwner,*/ characterController.edittingPage.bind(characterController));

character.get("/create", /*checkAuth, isCoAuthorOrOwner,*/ characterController.creationPage.bind(characterController));
character.post("/create", /*checkAuth, isCoAuthorOrOwner,*/ characterController.createItem.bind(characterController));

character.route("/:characterId")
    .get(characterController.itemPage.bind(characterController))
    .patch(/*checkAuth, isCoAuthorOrOwner,*/ characterController.updateItem.bind(characterController)) // edit
    .delete(/*checkAuth, isCoAuthorOrOwner,*/ characterController.deleteItem.bind(characterController)); // delete

export default character;