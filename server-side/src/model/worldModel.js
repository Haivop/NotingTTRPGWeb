import { db_connection } from "../db/MySqlDb.js";

export class WorldModel {
    static async getAll(){
        const [rows] = await db_connection.query(`SELECT * FROM Worlds`);
        return rows;
    }

    static async getById(world_id){
        const [rows] = await db_connection.query(`SELECT * FROM Worlds w WHERE w.id = ?`, [world_id]);
        return rows[0];
    }

    static async create(data, coAuthors){
        let preparedValues;
        let fieldNames = [];

        const [fields] = await db_connection.query(`SELECT * FROM Worlds w WHERE w.id = ? LIMIT 1`, [world_id]);
        
        for(obj in fields){ fieldNames.concat(obj.name) };

        for(item in data){
            preparedValues.concat("?, ");
            if(item === data[Object.keys(data)[Object.keys(data).length - 1]]){
                preparedValues.concat("?");
            }; 

            if(fieldNames.include(item)) continue;
            throw new Error("Wrong data marked in POST form! Fields in DB Table do not match with Data Object Keys");
        }

        try{
            db_connection.query(`INSERT INTO Worlds (id, ${Object.keys(data)}) 
                VALUES (uuid(), ${preparedValues})`, Object.values());

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
        let setQuery;
        let fieldNames = [];

        const [fields] = await db_connection.query(`SELECT * FROM Worlds w WHERE w.id = ? LIMIT 1`, [world_id]);
        
        for(obj in fields){ fieldNames.concat(obj.name) };

        for(item in Object.keys(newData)){
            setQuery.concat(`${item} = ?, `);
            if(item === data[Object.keys(data)[Object.keys(data).length - 1]]){
                setQuery.concat(`${item} = ?`);
            };

            if(fieldNames.include(item)) continue;
            throw new Error("Wrong data marked in PATCH form! Fields in DB Table do not match with Data Object Keys");
        };

        try{
            db_connection.query(`UPDATE Worlds w SET ${setQuery} WHERE w.id = ?`, Object.values(newData).concat([id]));

            for(user in coAuthors){
                if(this.getCoAuthors().include(user)) continue;
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
            db_connection.query(`DELETE FROM WorldCoAuthors wca WHERE w.id = ?`, [id])
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    static async getOwner(world_id){
        const [rows] = await db_connection.query(`SELECT w.owner_id FROM Worlds w WHERE w.id = ?`, [world_id]);
        return Object.values(rows[0]);
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
};