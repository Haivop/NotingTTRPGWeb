import { Router } from "express";

import { db_connection } from "../../db/MySqlDb.js";
import { checkAuth, isCoAuthorOrOwner } from "../../middleware/authMiddleware.js";
import { GeneralModel } from "../../model/GeneralModel.js";
import { WorldItemsController } from "../../controller/WorldItemsController.js";

const artifact = Router({ mergeParams: true });
const artifactModel = new GeneralModel(db_connection, "Artifacts");
artifactModel.init();
export const artifactController = new WorldItemsController(artifactModel);

artifact.get("/:artifactId/edit", checkAuth, isCoAuthorOrOwner, artifactController.edittingPage.bind(artifactController));

artifact.get("/create", /*checkAuth, isCoAuthorOrOwner,*/ artifactController.creationPage.bind(artifactController));
artifact.post("/create", /*checkAuth, isCoAuthorOrOwner,*/ artifactController.createItem.bind(artifactController));

artifact.route("/:artifactId")
    .get(artifactController.itemPage.bind(artifactController))
    .patch(/*checkAuth, isCoAuthorOrOwner,*/ artifactController.updateItem.bind(artifactController))
    .delete(/*checkAuth, isCoAuthorOrOwner,*/ artifactController.deleteItem.bind(artifactController));

export default artifact;