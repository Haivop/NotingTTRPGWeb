import { createPool } from "mysql2";

import MySQLconfig from "../../config/mysql_db_config";
const mySqlDbPool = createPool(MySQLconfig).promise();

export default mySqlDbPool;
