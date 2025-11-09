import { Router } from "express";
import { EventModel } from "../../model/world_features_models/eventModel.js";
import { checkAuth } from "../../middleware/authMiddleware.js";

const event = Router({ mergeParams: true });

event.route("/:eventId")
    .get((req, res) => {
        const { worldId, eventId } = req.params
        res.status(200).json({
            itemType: `Event`,
            item: EventModel.getById(eventId, worldId)
        });
    })
    .patch(checkAuth, (req, res) => {
        const { worldId, eventId } = req.params;
        const newData = {title, timeline_group, ingame_date, description} = req.body;

        EventModel.update(eventId, newData);

        res.status(200).json({
            message: "event data upadated",
            updatedData : EventModel.getById(eventId, worldId)
        });
    }) // edit
    .delete(checkAuth, (req, res) => {
        EventModel.delete(req.params.eventId);
        res.status(200).json({
            message: "event deleted"
        });
    }); // delete

event.get("/:eventId/edit", checkAuth, (req, res) => {
    const { worldId, eventId } = req.params;
    res.status(200).json({
        message: "event edit page",
        item: EventModel.getById(eventId, worldId)
    });
});

event.get("/create", checkAuth, (req, res) => {
    res.status(200).json({
        message: "event creation page"
    });
});
event.post("/create", checkAuth, (req, res) => {
    const eventData = {title, timeline_group, ingame_date, description} = req.body;
    eventData.world_id = { worldId } = req.params;

    EventModel.create(eventData);
    res.status(201).json({
        massage: "event created",
        created: eventData
    });
});

export default event;