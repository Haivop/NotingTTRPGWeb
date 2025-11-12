import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth, isCoAuthorOrOwner } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { GeneralCRUDHandlerModel } from "../../model/GeneralCRUDHandlerModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const location = Router({ mergeParams: true });
const locationModel = new GeneralModel(db_connection, "Locations");
locationModel.init();
export const locationController = new WorldItemsController(locationModel, new GeneralCRUDHandlerModel(locationModel));

location.get("/:locationId/edit", /*checkAuth, isCoAuthorOrOwner,*/ locationController.edittingPage.bind(locationController));

location.get("/create", /*checkAuth, isCoAuthorOrOwner,*/ locationController.creationPage.bind(locationController));
location.post("/create", /*checkAuth, isCoAuthorOrOwner,*/ locationController.createItem.bind(locationController));

location.route("/:locationId")
    .get(locationController.itemPage.bind(locationController))
    .patch(/*checkAuth, isCoAuthorOrOwner,*/ locationController.updateItem.bind(locationController)) // edit
    .delete(/*checkAuth, isCoAuthorOrOwner,*/ locationController.deleteItem.bind(locationController)); // delete

export default location;