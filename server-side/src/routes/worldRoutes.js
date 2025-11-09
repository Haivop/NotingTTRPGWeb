import { Router } from "express";

import artifact from "./world_features_routes/artifactRoutes.js";
import quest from "./world_features_routes/questRoutes.js";
import character from "./world_features_routes/characterRoutes.js";
import event from "./world_features_routes/eventRoutes.js";
import faction from "./world_features_routes/factionRoutes.js";
import location from "./world_features_routes/locationRoutes.js";

import { WorldModel } from "../model/worldModel.js";
import { ArtifactModel } from "../model/world_features_models/artifactModel.js";
import { CharacterModel } from "../model/world_features_models/characterModel.js";
import { EventModel } from "../model/world_features_models/eventModel.js";
import { FactionModel } from "../model/world_features_models/factionModel.js";
import { LocationModel } from "../model/world_features_models/locationModel.js";
import { QuestModel } from "../model/world_features_models/questModel.js";

import { checkAuth } from "../middleware/authMiddleware.js";

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
        const worldId = req.params.worldId;
        res.status(200).json({
            message: "Main page of this world",
            artifacts: ArtifactModel.getAll(worldId),
            characters: CharacterModel.getAll(worldId),
            events: EventModel.getAll(worldId),
            factions: FactionModel.getAll(worldId),
            locations: LocationModel.getAll(worldId),
            quests: QuestModel.getAll(worldId),
        })
    })
    .patch(checkAuth, (req, res) => {
        const worldId = req.params.worldId;
        const newData = {title, description, is_public, images_url} = req.body;
        WorldModel.update(worldId, newData);
        res.status(200).json({
            message: "world data upadated",
            updatedData : WorldModel.getById(worldId)
        });
    })
    .delete(checkAuth, (req, res) => {
        WorldModel.delete(req.params.worldId);
        res.status(200).json({
            message: "world deleted",
            updatedData : WorldModel.getById(worldId)
        });
    });

world.get("/:worldId/map", (req, res) => {}); 

world.route("/:worldId/edit")
    .get(checkAuth, (req, res) => { 
        res.status(200).json({
            message: "World edit page",
            world: WorldModel.getById(req.params.worldId),
        });
    });

world.route("/create")
    .get(checkAuth, (req, res) => {
        res.status(200).json({
            message: "World creation page"
        });
    })
    .post(checkAuth, (req, res) => {
        const worldData = {title, description, is_public, images_url} = req.body;
        worldData.user_id = req.user;

        WorldModel.create(worldData);
        res.status(201).json({
            message: "World created",
            created: worldData
        });
    });

export default world;