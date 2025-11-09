import { Router } from "express";
import { LocationModel } from "../../model/world_features_models/locationModel.js";
import { checkAuth } from "../../middleware/authMiddleware.js";

const location = Router({ mergeParams: true });

location.route("/:locationId")
    .get((req, res) => {
        const { worldId, locationId } = req.params
        res.status(200).json({
            itemType: `Location`,
            item: LocationModel.getById(locationId, worldId)
        });
    })
    .patch(checkAuth, (req, res) => {
        const { worldId, locationId } = req.params;
        const newData = { parent_location_id, name, type, description } = req.body;

        LocationModel.update(locationId, newData);

        res.status(200).json({
            message: "location data upadated",
            updatedData : LocationModel.getById(locationId, worldId)
        });
    }) // edit
    .delete(checkAuth, (req, res) => {
        LocationModel.delete(req.params.locationId);
        res.status(200).json({
            message: "location deleted"
        });
    }); // delete

location.get("/:locationId/edit", checkAuth, (req, res) => {
    const { worldId, locationId } = req.params;
    res.status(200).json({
        message: "location edit page",
        item: LocationModel.getById(locationId, worldId)
    });
});

location.get("/create", checkAuth, (req, res) => {
    res.status(200).json({
        message: "location creation page"
    });
});
location.post("/create", checkAuth, (req, res) => {
    const locationData = { parent_location_id, name, type, description } = req.body;
    locationData.world_id = { worldId } = req.params;

    LocationModel.create(locationData);
    res.status(201).json({
        massage: "location created",
        created: locationData
    });
});

export default location;