import mysql from "mysql2";
import { MySQLconfig } from "../../config/mysql_db_config.js";

export class MySqlDb{
    #connectionPool;

    constructor(config){
        this.#connectionPool = mysql.createPool(config).promise()
    }

    connect(){
        return this.#connectionPool;
    }
}

export const db_connection = new MySqlDb(MySQLconfig).connect();