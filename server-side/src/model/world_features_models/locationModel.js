import mySqlPool from "../../db/mySQL_db_connection.js";
import { WorldItem } from "./worldItemModel.js";

export class LocationModel extends WorldItem {
    static async getAll(world_id){
        const [locations] = await mySqlPool.query("SELECT l.* FROM Locations l JOIN Worlds w ON w.id = l.world_id", [world_id]);
        return locations;
    }

    static async getById(id, world_id){
        const location = await mySqlPool.query(`SELECT l.* FROM Locations l JOIN Worlds w ON w.id = l.world_id WHERE l.id = ?`, [world_id, id]);
        return location;
    }

    static async create(data){
        try{
            const {world_id, parent_location_id, title, type, description} = data;
            mySqlPool.query(`INSERT INTO Locations (id, world_id, parent_location_id, name, type, desctiption, map_x, map_y) 
                VALUES (uuid(), ?, ?, ?, ?, ?, null, null)`, 
                [world_id, parent_location_id, title, type, description]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async update(id, newData){
        try{
            const {parent_location_id, title, type, description} = newData;
            mySqlPool.query(`UPDATE Locations l SET character_id = ?, title = ?, description = ? WHERE l.id = ?`, 
                [parent_location_id, title, type, description, id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async delete(id){
        try{
            mySqlPool.query(`DELETE FROM Locations l WHERE l.id = ?`, [id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }
}