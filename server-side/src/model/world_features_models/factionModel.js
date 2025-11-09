import mySqlPool from "../../db/mySQL_db_connection.js";
import { WorldItem } from "./worldItemModel.js";

export class FactionModel extends WorldItem {
    static async getAll(world_id){
        const [factions] = await mySqlPool.query("SELECT f.* FROM Factions f JOIN Worlds w ON w.id = f.world_id", [world_id]);
        return factions;
    }

    static async getById(id, world_id){
        const faction = await mySqlPool.query(`SELECT f.* FROM Factions f JOIN Worlds w ON w.id = f.world_id WHERE f.id = ?`, [world_id, id]);
        return faction;
    }

    static async create(data){
        try{
            const {world_id, location_id, title, motto, description} = data;
            mySqlPool.query(`INSERT INTO Factions (id, world_id, location_id, title, motto, description) 
                VALUES (uuid(), ?, ?, ?, ?, ?)`, 
                [world_id, location_id, title, motto, description]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async update(id, newData){
        try{
            const {location_id, title, motto, description} = newData;
            mySqlPool.query(`UPDATE Factions f SET location_id = ?, title = ?, motto = ?, description = ? WHERE f.id = ?`, 
                [location_id, title, motto, description, id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async delete(id){
        try{
            mySqlPool.query(`DELETE FROM Factions f WHERE f.id = ?`, [id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }
}