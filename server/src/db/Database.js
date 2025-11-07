const mysql = require("mysql2");

export class Database {
    #dsn = undefined;
    #connection = undefined;

    constructor(config){
        this.#dsn = {
            host: `${config['host']}`,
            user: `${config['user']}`,
            password: `${config['password']}`,
            database: `${config['database']}`,
        }

        this.#connection = mysql.createConnection(this.#dsn);
        
        try {
            this.#connection.connect((err) => {
                if (err) throw err;
                console.log("MySQL DB Connected!")
            });
        } catch (err) {
            throw new Error(`Database connection failed: ${err}`);
        }
    };

    getConnection(){
        return this.#connection;
    }
}