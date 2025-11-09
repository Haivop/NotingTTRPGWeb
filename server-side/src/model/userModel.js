import mySqlPool from "../db/mySQL_db_connection.js";

export class User {
    static async getAll(){
        const [users] = await mySqlPool.query("SELECT * FROM Users");
        return users;
    }

    static async getById(id){
        const user = await mySqlPool.query(`SELECT * FROM Users u WHERE u.id = ?`, id);
        return user;
    }

    static async create(data){
        try{
            const { username, email, password } = data;
            mySqlPool.query(`INSERT INTO Users (id, username, email, password_hash, role, creation_date) 
                VALUES (uuid(), ?, ?, ?, 'user', CURDATE())`, [username, email, password]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }
};