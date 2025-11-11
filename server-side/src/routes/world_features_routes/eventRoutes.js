import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth, isCoAuthorOrOwner } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const event = Router({ mergeParams: true });
const eventModel = new GeneralModel(db_connection, "Events");
eventModel.init();
export const eventController = new WorldItemsController(eventModel);

event.get("/:eventId/edit", /*checkAuth, isCoAuthorOrOwner,*/ eventController.edittingPage.bind(eventController));

event.get("/create", /*checkAuth, isCoAuthorOrOwner,*/ eventController.creationPage.bind(eventController));
event.post("/create", /*checkAuth, isCoAuthorOrOwner,*/ eventController.createItem.bind(eventController));

event.route("/:eventId")
    .get(eventController.itemPage.bind(eventController).bind(eventController))
    .patch(/*checkAuth, isCoAuthorOrOwner,*/ eventController.updateItem.bind(eventController)) // edit
    .delete(/*checkAuth, isCoAuthorOrOwner,*/ eventController.deleteItem.bind(eventController)); // delete

export default event;