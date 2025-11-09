import mySqlPool from "../db/mySQL_db_connection.js";
import { WorldItem } from "./worldItemModel.js";

export class Location extends WorldItem {
    static async getAll(){
        const [locations] = await mySqlPool.query("SELECT l.* FROM Locations l JOIN Worlds w ON w.id = l.world_id");
        return locations;
    }

    static async getById(id){
        const location = await mySqlPool.query(`SELECT l.* FROM Locations l JOIN Worlds w ON w.id = l.world_id WHERE l.id = ?`, id);
        return location;
    }

    static async create(data){
        try{
            const {world_id, parent_location_id, name, type, description} = data;
            mySqlPool.query(`INSERT INTO Locations (id, world_id, parent_location_id, name, type, desctiption, map_x, map_y) 
                VALUES (uuid(), ?, ?, ?, ?, ?, null, null)`, 
                [world_id, parent_location_id, name, type, description]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async update(id, newData){
        try{
            const {parent_location_id, name, type, description} = newData;
            mySqlPool.query(`UPDATE Locations l SET character_id = ?, title = ?, description = ? WHERE l.id = ?`, 
                [parent_location_id, name, type, description, id]);
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