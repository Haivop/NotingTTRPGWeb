import mySqlPool from "../db/mySQL_db_connection.js";
import { WorldItem } from "./worldItemModel.js";

export class Quest extends WorldItem {
    static async getAll(){
        const [quests] = await mySqlPool.query("SELECT q.* FROM Quests q JOIN Worlds w ON w.id = q.world_id");
        return quests;
    }

    static async getById(id){
        const quest = await mySqlPool.query(`SELECT q.* FROM Quests q JOIN Worlds w ON w.id = q.world_id WHERE q.id = ?`, id);
        return quest;
    }

    static async create(data){
        try{
            const {world_id, status, title, reward, objective, description} = data;
            mySqlPool.query(`INSERT INTO Quests (id, world_id, status, title, reward, objective, description) 
                VALUES (uuid(), ?, ?, ?, ?, ?, ?)`, 
                [world_id, status, title, reward, objective, description]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async update(id, newData){
        try{
            const {status, title, reward, objective, description} = newData;
            mySqlPool.query(`UPDATE Quests q SET status = ?, title = ?, reward = ?, objective = ?, description = ? WHERE q.id = ?`, 
                [status, title, reward, objective, description, id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async delete(id){
        try{
            mySqlPool.query(`DELETE FROM Quests q WHERE q.id = ?`, [id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }
}