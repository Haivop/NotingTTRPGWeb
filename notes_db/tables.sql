CREATE TABLE `Users`(
    `id` VARCHAR(36) PRIMARY KEY,
    `username` VARCHAR(30) UNIQUE NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `creation_date` DATETIME NOT NULL
);

CREATE TABLE `Worlds`(
    `id` VARCHAR(36) PRIMARY KEY,
    `owner_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NULL,
    `is_public` BOOLEAN DEFAULT TRUE,
    `map_url` VARCHAR(255) NULL,
    `creation_date` DATETIME NOT NULL,
    `last_update_date` DATETIME NOT NULL
);

CREATE TABLE `WorldCoAuthors`(
    `user_id` VARCHAR(36),
    `world_id` VARCHAR(36),
    PRIMARY KEY (user_id, world_id)
);

CREATE TABLE `Locations`(
    `id` VARCHAR(36) PRIMARY KEY,
    `world_id` VARCHAR(36) NOT NULL,
    `parent_location_id` VARCHAR(36) NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` ENUM('Continent', 'Region', 'Location') NOT NULL,
    `description` LONGTEXT NULL,
    `map_x` FLOAT NULL,
    `map_y` FLOAT NULL,
    CONSTRAINT `locations_world_id_frk` FOREIGN KEY(`world_id`) REFERENCES `Worlds`(`id`)
);

CREATE TABLE `Factions`(
    `id` VARCHAR(36) PRIMARY KEY,
    `world_id` VARCHAR(36) NOT NULL,
    `location_id` VARCHAR(36) NULL,
    `title` VARCHAR(255) NOT NULL,
    `motto` VARCHAR(255) NULL,
    `description` LONGTEXT NULL,
    CONSTRAINT `factions_world_id_frk` FOREIGN KEY(`world_id`) REFERENCES `Worlds`(`id`)
);

CREATE TABLE `Characters`(
    `id` VARCHAR(36) PRIMARY KEY,
    `world_id` VARCHAR(36) NOT NULL,
    `faction_id` VARCHAR(36) NULL,
    `name` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NULL,
    `description` LONGTEXT NULL,
    CONSTRAINT `characters_world_id_frk` FOREIGN KEY(`world_id`) REFERENCES `Worlds`(`id`)
);

CREATE TABLE `Artifacts`(
    `id` VARCHAR(36) PRIMARY KEY,
    `world_id` VARCHAR(36) NOT NULL,
    `character_id` VARCHAR(36) NULL,
    `title` VARCHAR(50) NOT NULL,
    `description` LONGTEXT NULL,
    CONSTRAINT `artifacts_world_id_frk` FOREIGN KEY(`world_id`) REFERENCES `Worlds`(`id`)
);

CREATE TABLE `Quests`(
    `id` VARCHAR(36) PRIMARY KEY,
    `world_id` VARCHAR(36) NOT NULL,
    `status` ENUM('Not Assigned', 'Assigned', 'In Progress', 'Done'),
    `title` VARCHAR(50) NOT NULL,
    `reward` TEXT NULL,
    `objective` TEXT NULL,
    `description` LONGTEXT NULL,
    CONSTRAINT `quests_world_id_frk` FOREIGN KEY(`world_id`) REFERENCES `Worlds`(`id`)
);

CREATE TABLE `Events`(
    `id` VARCHAR(36) PRIMARY KEY,
    `world_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(50) NOT NULL,
    `timeline_group` VARCHAR(50) NULL,
    `ingame_date` VARCHAR(255) NULL,
    `description` LONGTEXT NULL,
    CONSTRAINT `events_world_id_frk` FOREIGN KEY(`world_id`) REFERENCES `Worlds`(`id`)
);