import { createPool } from "mysql2";
import { MySQLconfig } from "../../config/mysql_db_config.js";

const mySqlDbPool = createPool(MySQLconfig).promise();
console.log("DB connected");

export default mySqlDbPool;
