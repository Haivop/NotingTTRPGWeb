import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const location = Router({ mergeParams: true });
const locationModel = new GeneralModel(db_connection, "Locations").init();
const locationController = new WorldItemsController(locationModel);

location.route("/:locationId")
    .get(locationController.itemPage)
    .patch(checkAuth, locationController.updateItem) // edit
    .delete(checkAuth, locationController.deleteItem); // delete

location.get("/:locationId/edit", checkAuth, locationController.edittingPage);

location.get("/create", checkAuth, locationController.creationPage);
location.post("/create", checkAuth, locationController.createItem);

export default location;