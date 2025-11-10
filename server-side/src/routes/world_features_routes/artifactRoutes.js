import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const artifact = Router({ mergeParams: true });
const artifactModel = new GeneralModel(db_connection, "Artifacts").init();
const artifactController = new WorldItemsController(artifactModel);

artifact.route("/:artifactId")
    .get(artifactController.itemPage)
    .patch(checkAuth, artifactController.updateItem)
    .delete(checkAuth, artifactController.deleteItem);

artifact.get("/:artifactId/edit", checkAuth, artifactController.edittingPage);

artifact.get("/create", checkAuth, artifactController.creationPage);
artifact.post("/create", checkAuth, artifactController.createItem);

export default artifact;