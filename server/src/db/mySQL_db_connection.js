import { Database } from "./Database";

const MySQLconfig = require("../../config/mysql_db");
const mySqlDb = new Database(MySQLconfig);

module.exports = mySqlDb.getConnection();
