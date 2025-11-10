export class GeneralModel {
    connectionPool;
    #exceptionFields = ["id", "creation_date"];

    name = "";
    pseudo = "";
    fieldNames = [];

    constructor(connectionPool, name){
        this.connectionPool = connectionPool;
        this.name = name;
        this.pseudo = name.split(" ")[0].toLowerCase();

        if(this.name === "WorldCoAuthors"){
            throw new Error("Inconsistent DB table name");
        }
    };

    async init(){
        const [fields] = await this.connectionPool.query(`SELECT * FROM ${this.name} LIMIT 1`)
            .catch((err) => {
                const error = new Error("Inconsistent DB table name or" + err);
                error.status = 404;
                throw error;
            });
        
        for(obj in fields){
            if(this.#exceptionFields.includes(obj.name)) continue;
            fieldNames.push() = obj.name;
        }
    };
}