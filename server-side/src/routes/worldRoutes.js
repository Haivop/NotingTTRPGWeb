import { Router } from "express";

import artifact from "./world_features_routes/artifactRoutes.js";
import quest from "./world_features_routes/questRoutes.js";
import character from "./world_features_routes/characterRoutes.js";
import event from "./world_features_routes/eventRoutes.js";
import faction from "./world_features_routes/factionRoutes.js";
import location from "./world_features_routes/locationRoutes.js";

import { checkAuth, isOwner } from "../middleware/authMiddleware.js";
import { WorldController } from "../controller/WorldController.js"

//world router
const world = Router({ mergeParams: true });

world.use("/:worldId/artifact", artifact);
world.use("/:worldId/quest", quest);
world.use("/:worldId/character", character);
world.use("/:worldId/event", event);
world.use("/:worldId/faction", faction);
world.use("/:worldId/location", location);

world.route("/:worldId/edit")
    .get(/* checkAuth, isOwner,*/ WorldController.edditingPage);

world.get("/:worldId/map", WorldController.mapPage); 

world.route("/:worldId")
    .get(WorldController.mainPage)
    .post(checkAuth, WorldController.create)
    .patch(/* checkAuth, isOwner,*/  WorldController.update)
    .delete(/* checkAuth, isOwner,*/  WorldController.delete);

world.get("/create", /*checkAuth,*/ WorldController.creationPage);

export default world;