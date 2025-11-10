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
    .patch(checkAuth, eventController.updateItem) // edit
    .delete(checkAuth, eventController.deleteItem); // delete

event.get("/:eventId/edit", eventController.edittingPage);

event.get("/create", checkAuth, eventController.creationPage);
event.post("/create", checkAuth, eventController.createItem);

export default event;