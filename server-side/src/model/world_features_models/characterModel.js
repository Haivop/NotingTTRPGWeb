import mySqlPool from "../db/mySQL_db_connection.js";
import { WorldItem } from "./worldItemModel.js";

export class Character extends WorldItem {
    static async getAll(){
        const [characters] = await mySqlPool.query("SELECT c.* FROM Characters c JOIN Worlds w ON w.id = c.world_id");
        return characters;
    }

    static async getById(id){
        const character = await mySqlPool.query(`SELECT c.* FROM Characters c JOIN Worlds w ON w.id = c.world_id WHERE c.id = ?`, id);
        return character;
    }

    static async create(data){
        try{
            const {world_id, faction_id, name, role, description} = data;
            mySqlPool.query(`INSERT INTO Characters (id, world_id, faction_id, name, role, description) 
                VALUES (uuid(), ?, ?, ?, ?, ?)`, 
                [world_id, faction_id, name, role, description]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async update(id, newData){
        try{
            const {faction_id, name, role, description} = newData;
            mySqlPool.query(`UPDATE Characters c SET faction_id = ?, role = ?, name = ?, description = ? WHERE c.id = ?`, 
                [faction_id, name, role, description, id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async delete(id){
        try{
            mySqlPool.query(`DELETE FROM Characters c WHERE c.id = ?`, [id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }
}