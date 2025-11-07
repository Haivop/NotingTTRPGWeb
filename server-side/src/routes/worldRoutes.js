import { Router } from "express";

import artifact from "./world_features_routes/artifactRoutes";
import quest from "./world_features_routes/questRoutes";
import character from "./world_features_routes/characterRoutes";
import event from "./world_features_routes/eventRoutes";
import faction from "./world_features_routes/factionRoutes";
import location from "./world_features_routes/locationRoutes";

//world router
const world = Router({ mergeParams: true });

world.use("/:worldId/artifact", artifact);
world.use("/:worldId/quest", quest);
world.use("/:worldId/character", character);
world.use("/:worldId/event", event);
world.use("/:worldId/faction", faction);
world.use("/:worldId/location", location);

world.route("/:worldId")
    .get((req, res) => {
        res.send("World homepage !");
    })
    .post((req, res) => {})
    .delete((req, res) => {});

world.get("/:worldId/map", (req, res) => {});

world.route("/:worldId/edit")
    .get((req, res) => {})
    .post((req, res) => {})
    .delete((req, res) => {});

world.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

export default world;