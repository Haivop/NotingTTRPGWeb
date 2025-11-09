import mySqlPool from "../db/mySQL_db_connection.js";
import { WorldItem } from "./worldItemModel.js";

export class Artifact extends WorldItem {
    static async getAll(){
        const [artifacts] = await mySqlPool.query("SELECT a.* FROM Artifacts a JOIN Worlds w ON w.id = a.world_id");
        return artifacts;
    }

    static async getById(id){
        const artifact = await mySqlPool.query(`SELECT a.* FROM Artifacts a JOIN Worlds w ON w.id = a.world_id WHERE a.id = ?`, id);
        return artifact;
    }

    static async create(data){
        try{
            const {world_id, character_id, title, description} = data;
            mySqlPool.query(`INSERT INTO Artifacts (id, world_id, character_id, title, desctiption) 
                VALUES (uuid(), ?, ?, ?, ?)`, 
                [world_id, character_id, title, description]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async update(id, newData){
        try{
            const {character_id, title, description} = newData;
            mySqlPool.query(`UPDATE Artifacts a SET character_id = ?, title = ?, description = ? WHERE a.id = ?`, 
                [character_id, title, description, id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async delete(id){
        try{
            mySqlPool.query(`DELETE FROM Artifacts a WHERE a.id = ?`, [id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }
}