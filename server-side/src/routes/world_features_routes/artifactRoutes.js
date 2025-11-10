import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth, isCoAuthorOrOwner } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const artifact = Router({ mergeParams: true });
const artifactModel = new GeneralModel(db_connection, "Artifacts").init();
const artifactController = new WorldItemsController(artifactModel);

artifact.route("/:artifactId")
    .get(artifactController.itemPage)
    .patch(checkAuth, isCoAuthorOrOwner, artifactController.updateItem)
    .delete(checkAuth, isCoAuthorOrOwner, artifactController.deleteItem);

artifact.get("/:artifactId/edit", checkAuth, isCoAuthorOrOwner, artifactController.edittingPage);

artifact.get("/create", checkAuth, isCoAuthorOrOwner, artifactController.creationPage);
artifact.post("/create", checkAuth, isCoAuthorOrOwner, artifactController.createItem);

export default artifact;