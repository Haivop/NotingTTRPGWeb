import { db_connection } from "../db/MySqlDb.js";

export class UserModel {
    static async getAll(){
        const [rows] = await db_connection.query("SELECT * FROM Users");
        return rows;
    }

    static async getById(id){
        const [rows] = await db_connection.query(`SELECT * FROM Users u WHERE u.id = ?`, id);
        return rows[0];
    }

    static async create(data){
        try{
            const { username, email, password } = data;
            db_connection.query(`INSERT INTO Users (id, username, email, password_hash, role, creation_date) 
                VALUES (uuid(), ?, ?, ?, 'user', CURDATE())`, [username, email, password]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }
};