export class GeneralModel {
    connection;
    #exceptionFields = ["id", "creation_date"];

    name = "";
    pseudo = "";
    fieldNames = [];

    constructor(connectionPool, name){
        this.connection = connectionPool;
        this.name = name;
        this.pseudo = name[0].toLowerCase();

        if(this.name === "WorldCoAuthors"){
            throw new Error("Inconsistent DB table name");
        }
    };

    getName(){
        return this.name;
    }

    async init(){
        const [rows] = await this.connection.query(`SHOW columns FROM ${this.name}`)
            .catch((err) => {
                const error = new Error("Inconsistent DB table name or" + err);
                error.status = 404;
                throw error;
            });

        for(let row of rows){
            if(this.#exceptionFields.includes(row.Field)) continue;
            this.fieldNames.push(row.Field);
        }
    };
}