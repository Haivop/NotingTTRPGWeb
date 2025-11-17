import { db_connection } from "../db/MySqlDb.js";

export class WorldModel {
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

    static async getAll(){
        const [rows] = await db_connection.query(`SELECT * FROM Worlds`);
        return rows;
    }

    static async getAllPublic(){
        const [rows] = await db_connection.query(`SELECT * FROM Worlds w WHERE w.is_public = 1`);
        return rows;
    }

    static async getByUser(user_id){
        const [rows] = await db_connection.query(`SELECT * FROM Worlds w WHERE w.owner_id = ?`, [user_id]);
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

    static async update(id, newData, coAuthors, tags){
        let fieldNames = await this.getFieldNames();

        for(let item of Object.keys(newData)){
            if(fieldNames.includes(item)) continue;
            throw new Error("Wrong data marked in PATCH form! Fields in DB Table do not match with Data Object Keys");
        };

        try{
            db_connection.query(`UPDATE Worlds w SET ? WHERE w.id = ?`, [newData, id]);
            this.#coAuthorsMenagement(coAuthors, id);
            this.#tagsMenagement(tags, id);
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

    static async #coAuthorsMenagement(coAuthors, world_id){
        let currentCoAuthors = await this.getCoAuthors(world_id);

        for(let user in coAuthors){
            if(currentCoAuthors.includes(user)) {
                delete currentCoAuthors[currentCoAuthors.indexOf(user)];
                continue;
            }
            this.addCoAuthor(user.id, world_id);
        };

        if (!Array.isArray(currentCoAuthors) || !currentCoAuthors.length) return;

        currentCoAuthors.map((co) => {this.removeCoAuthor(co.id, world_id)});
    }

    static async getTags(world_id){
        const [rows] = await db_connection.query(`SELECT t.* FROM Tags t WHERE t.world_id = ?`, [world_id]);
        return rows;
    }

    static async addTag(tag, world_id){
        try{
            db_connection.query(`INSERT INTO Tags (id, tag, world_id) VALUES (uuid(), ?, ?)`, [tag, world_id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async removeTag(tag, world_id){
        try{
            db_connection.query(`DELETE FROM Tags t WHERE t.tag = ? AND t.world_id = ?`, [tag, world_id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async #tagsMenagement(tags, world_id){
        let currentTags = await this.getTags(world_id);

        for(let tag in tags){
            if(currentTags.includes(tag)) {
                delete currentTags[currentTags.indexOf(tag)];
                continue;
            }
            this.addTag(tag, world_id);
        };

        if (!Array.isArray(currentTags) || !currentTags.length) return;

        currentTags.map((co) => {this.removeTag(co.id, world_id)});
    }
};