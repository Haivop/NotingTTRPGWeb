import { WorldModel } from "../model/WorldModel.js";

export class WorldController{
    static async mainPage (req, res) {
        const worldId = req.params.worldId;
        res.status(200).json({
            message: "Main page of this world",
            artifacts: ArtifactModel.getAll(worldId),
            characters: CharacterModel.getAll(worldId),
            events: EventModel.getAll(worldId),
            factions: FactionModel.getAll(worldId),
            locations: LocationModel.getAll(worldId),
            quests: QuestModel.getAll(worldId),
        });
    };

    static async edditingPage (req, res) { 
        res.status(200).json({
            message: "World edit page",
            world: WorldModel.getById(req.params.worldId),
        });
    }

    static async creationPage (req, res) {
        res.status(200).json({
            message: "World creation page"
        });
    }

    static async update (req, res) {
        const worldId = req.params.worldId;
        const newData = {title, description, is_public, images_url} = req.body;
        WorldModel.update(worldId, newData);
        res.status(200).json({
            message: "world data upadated",
            updatedData : WorldModel.getById(worldId)
        });
    };

    static async delete (req, res) {
        WorldModel.delete(req.params.worldId);
        res.status(200).json({
            message: "world deleted",
            updatedData : WorldModel.getById(worldId)
        });
    };

    static async create (req, res) {
        const worldData = {title, description, is_public, images_url} = req.body;
        worldData.user_id = req.user;

        WorldModel.create(worldData);
        res.status(201).json({
            message: "World created",
            created: worldData
        });
    }
}