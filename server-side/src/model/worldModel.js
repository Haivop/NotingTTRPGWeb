import { db_connection } from "../db/MySqlDb.js";

export class WorldModel {
    static async getAll(){
        const [rows] = await db_connection.query(`SELECT * FROM Worlds`);
        return rows;
    }

    static async getById(world_id){
        const [rows] = await db_connection.query(`SELECT * FROM Worlds w WHERE w.id = ?`, [world_id]);
        return rows;
    }

    static async create(data, coAuthors){
        let fieldNames = await this.getFieldNames();

        for(let item of Object.keys(data)){
            if(fieldNames.includes(item)) continue;
            throw new Error("Wrong data marked in POST form! Fields in DB Table do not match with Data Object Keys");
        }

        try{
            await db_connection.query(`INSERT INTO Worlds SET id = uuid(), ?, creation_date = CURDATE(), last_update_date = CURDATE()`, data);
            if(!coAuthors) return;

            for(user in coAuthors){
                this.addCoAuthor(user.id);
            }
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async update(id, newData, coAuthors){
        let fieldNames = await this.getFieldNames();

        for(let item of Object.keys(newData)){
            if(fieldNames.includes(item)) continue;
            throw new Error("Wrong data marked in PATCH form! Fields in DB Table do not match with Data Object Keys");
        };

        try{
            db_connection.query(`UPDATE Worlds w SET ? WHERE w.id = ?`, [newData, id]);

            for(let user in coAuthors){
                if(this.getCoAuthors().includes(user)) continue;
                this.addCoAuthor(user.id);
            };
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async delete(id){
        try{
            db_connection.query(`DELETE FROM Worlds w WHERE w.id = ?`, [id]);

            if(!this.getCoAuthors(id)) return;
            db_connection.query(`DELETE FROM WorldCoAuthors wca WHERE wca.world_id = ?`, [id])
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async getOwner(world_id){
        const [rows] = await db_connection.query(`SELECT w.owner_id FROM Worlds w WHERE w.id = ?`, [world_id]);
        return rows[0];
    }

    static async getCoAuthors(world_id){
        const [rows] = await db_connection.query(`SELECT u.* FROM Users u JOIN WorldCoAuthors wca ON wca.user_id = u.id WHERE wca.world_id = ?`, [world_id]);
        return rows;
    }

    static async addCoAuthor(user_id, world_id){
        try{
            db_connection.query(`INSERT INTO WorldCoAuthors (user_id, world_id) VALUES (?, ?)`, [user_id, world_id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async removeCoAuthor(user_id, world_id){
        try{
            db_connection.query(`DELETE FROM WorldCoAuthors wca WHERE wca.user_id = ? AND wca.world_id = ?`, [user_id, world_id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async getFieldNames(){
        let fieldNames = [];

        const [rows] = await db_connection.query(`SHOW columns FROM Worlds`)
            .catch((err) => {
                const error = new Error("Inconsistent DB table name or" + err);
                error.status = 404;
                throw error;
            });
        
        for(let row of rows){ fieldNames.push(row.Field) }

        return fieldNames;
    }
};