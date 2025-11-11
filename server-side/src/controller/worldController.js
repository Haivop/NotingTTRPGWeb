import { WorldModel } from "../model/worldModel.js";
import { artifactController } from "../routes/world_features_routes/artifactRoutes.js";
import { characterController } from "../routes/world_features_routes/characterRoutes.js";
import { eventController } from "../routes/world_features_routes/eventRoutes.js";
import { factionController } from "../routes/world_features_routes/factionRoutes.js";
import { locationController } from "../routes/world_features_routes/locationRoutes.js";
import { questController } from "../routes/world_features_routes/questRoutes.js";


export class WorldController{
    static async mainPage (req, res) {
        const worldId = req.params.worldId;
        res.status(200).json({
            message: "Main page of this world",
            artifacts: await artifactController.getCRUDHandler().getAll(worldId),
            characters: await characterController.getCRUDHandler().getAll(worldId),
            events: await eventController.getCRUDHandler().getAll(worldId),
            factions: await factionController.getCRUDHandler().getAll(worldId),
            locations: await locationController.getCRUDHandler().getAll(worldId),
            quests: await questController.getCRUDHandler().getAll(worldId),
        });
    };

    static async edditingPage (req, res) { 
        res.status(200).json({
            message: "World edit page",
            world: await WorldModel.getById(req.params.worldId),
        });
    }

    static async creationPage (req, res) {
        res.status(200).json({
            message: "World creation page"
        });
    }

    static async update (req, res) {
        const worldId = req.params.worldId;
        const {title, description, is_public, map_url} = req.body;

        await WorldModel.update(worldId, {title, description, is_public, map_url});
        const updatedData = await WorldModel.getById(worldId);

        res.status(200).json({
            message: "world data upadated",
            updatedData
        });
    };

    static async delete (req, res) {
        WorldModel.delete(req.params.worldId);
        res.status(200).json({
            message: "world deleted"
        });
    };

    static async create (req, res) {
        const {title, description, is_public, map_url} = req.body;
        const {coAuthors} = req.body;
        const owner_id = req.user.id;

        await WorldModel.create({owner_id, title, description, is_public, map_url}, coAuthors);
        res.status(201).json({
            message: "World created",
            created: {
                owner_id, 
                title, 
                description, 
                is_public, 
                map_url, 
                coAuthors
            } 
        });
    }
}