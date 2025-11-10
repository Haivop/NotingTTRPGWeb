import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const event = Router({ mergeParams: true });
const eventModel = new GeneralModel(db_connection, "Events").init();
const eventController = new WorldItemsController(eventModel);

event.route("/:eventId")
    .get(eventController.itemPage)
    .patch(checkAuth, isCoAuthorOrOwner, eventController.updateItem) // edit
    .delete(checkAuth, isCoAuthorOrOwner, eventController.deleteItem); // delete

event.get("/:eventId/edit", isCoAuthorOrOwner, eventController.edittingPage);

event.get("/create", checkAuth, isCoAuthorOrOwner, eventController.creationPage);
event.post("/create", checkAuth, isCoAuthorOrOwner, eventController.createItem);

export default event;