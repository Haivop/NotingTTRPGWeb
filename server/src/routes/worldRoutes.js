const express = require("express");
const world = express.Router({ mergeParams: true });

const artifact = require("./world_features_routes/artifactRoutes");
const quest = require("./world_features_routes/questRoutes");
const character = require("./world_features_routes/characterRoutes");
const event = require("./world_features_routes/eventRoutes");
const faction = require("./world_features_routes/factionRoutes");
const location = require("./world_features_routes/locationRoutes");

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

world.route("/create")
    .get((req, res) => {})
    .post((req, res) => {});

module.exports = world;