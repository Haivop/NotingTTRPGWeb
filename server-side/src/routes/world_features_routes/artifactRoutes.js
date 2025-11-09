import { Router } from "express";
import { ArtifactModel } from "../../model/world_features_models/artifactModel.js";
import { checkAuth } from "../../middleware/authMiddleware.js";

const artifact = Router({ mergeParams: true });

artifact.route("/:artifactId")
    .get((req, res) => {
        const { worldId, artifactId } = req.params
        res.status(200).json({
            itemType: `Artifact`,
            item: ArtifactModel.getById(artifactId, worldId)
        });
    }) // view page
    .patch(checkAuth, (req, res) => {
        const { worldId, artifactId } = req.params;
        const newData = {character_id, title, description} = req.body;

        ArtifactModel.update(artifactId, newData);

        res.status(200).json({
            message: "artifact data upadated",
            updatedData : ArtifactModel.getById(artifactId, worldId)
        });
    }) // edit
    .delete(checkAuth, (req, res) => {
        ArtifactModel.delete(req.params.artifactId);
        res.status(200).json({
            message: "Artifact deleted"
        });
    }); // delete

artifact.get("/:artifactId/edit", checkAuth, (req, res) => {
    const { worldId, artifactId } = req.params;
    res.status(200).json({
        message: "Artifact edit page",
        item: ArtifactModel.getById(artifactId, worldId)
    });
}); // view edit page

artifact.get("/create", checkAuth, (req, res) => {
    res.status(200).json({
        message: "Artifact creation page"
    });
}); // view create page
artifact.post("/create", checkAuth, (req, res) => {
    const artifactData = {character_id, title, description} = req.body;
    artifactData.world_id = { worldId } = req.params;

    ArtifactModel.create(artifactData);
    res.status(201).json({
        message: "Artifact created",
        created: artifactData
    });
});

export default artifact;