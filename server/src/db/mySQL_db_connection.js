import { Database } from "./Database";

const MySQLconfig = require("../../configs/mysql_db");
const mySqlDb = new Database(MySQLconfig);

module.exports = mySqlDb.getConnection();
