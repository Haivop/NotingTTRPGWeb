import mySqlPool from "../db/mySQL_db_connection.js";

export class WorldModel {
    static async getAll(){
        const [worlds] = await mySqlPool.query("SELECT * FROM Worlds");
        return worlds;
    }

    static async getById(id){
        const world = await mySqlPool.query(`SELECT * FROM Worlds w WHERE w.id = ?`, id);
        return world;
    }

    static async create(data){
        try{
            const {user_id, title, description, is_public, images_url} = data;
            mySqlPool.query(`INSERT INTO Worlds (id, owner_id, title, description, is_public, map_url, creation_date, last_update_date) 
                VALUES (uuid(), ?, ?, ?, ?, ?, CURDATE(), CURDATE())`, 
                [user_id, title, description, is_public, images_url]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async update(id, newData){
        try{
            const {title, description, is_public, images_url} = newData;
            mySqlPool.query(`UPDATE Worlds w SET title = ?, description = ?, is_public = ?, 
                images_url = ?, last_update_date = CURDATE() WHERE w.id = ?`, [title, description, is_public, images_url, id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async delete(id){
        try{
            mySqlPool.query(`DELETE FROM Worlds w WHERE w.id = ?`, [id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async addCoAuthor(data){
        try{
            const {user_id, world_id} = data;
            mySqlPool.query(`INSERT INTO WorldCoAuthors (user_id, world_id) VALUES (?, ?)`, [user_id, world_id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async removeCoAuthor(data){
        try{
            const {user_id, world_id} = data;
            mySqlPool.query(`DELETE FROM WorldCoAuthors wca WHERE wca.user_id = ? AND wca.world_id = ?`, [user_id, world_id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }
};