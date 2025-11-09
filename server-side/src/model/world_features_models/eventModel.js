import mySqlPool from "../../db/mySQL_db_connection.js";
import { WorldItem } from "./worldItemModel.js";

export class EventModel extends WorldItem {
    static async getAll(world_id){
        const [artifacts] = await mySqlPool.query("SELECT e.* FROM Events e JOIN Worlds w ON w.id = e.world_id", [world_id]);
        return artifacts;
    }

    static async getById(id, world_id){
        const world = await mySqlPool.query(`SELECT e.* FROM Events e JOIN Worlds w ON w.id = e.world_id WHERE e.id = ?`, [world_id, id]);
        return world;
    }

    static async create(data){
        try{
            const {world_id, title, timeline_group, ingame_date, description} = data;
            mySqlPool.query(`INSERT INTO Events (id, world_id, title, timeline_group, ingame_date, desctiption) 
                VALUES (uuid(), ?, ?, ?, ?, ?)`, 
                [world_id, title, timeline_group, ingame_date, description]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async update(id, newData){
        try{
            const {title, timeline_group, ingame_date, description} = newData;
            mySqlPool.query(`UPDATE Events e SET title = ?, timeline_group = ?, ingame_date = ?, description = ? WHERE e.id = ?`, 
                [title, timeline_group, ingame_date, description, id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async delete(id){
        try{
            mySqlPool.query(`DELETE FROM Events e WHERE e.id = ?`, [id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }
}