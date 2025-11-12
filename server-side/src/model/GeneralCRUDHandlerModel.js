export class GeneralCRUDHandlerModel{
    #model;
    #connection;

    constructor(model){
        this.#model = model
        this.#connection = model.connection;
    };
    
    async getAll(world_id){
        const [rows] = await this.#connection.query(`SELECT ${this.#model.pseudo}.* FROM ${this.#model.name} ${this.#model.pseudo} 
            WHERE ${this.#model.pseudo}.world_id = ?`, [world_id]);
        return rows;
    }

    async getById(id){
        const [rows] = await this.#connection.query(`SELECT ${this.#model.pseudo}.* FROM ${this.#model.name} ${this.#model.pseudo} 
            JOIN Worlds w ON w.id = ${this.#model.pseudo}.world_id WHERE ${this.#model.pseudo}.id = ?`, [id]);
        return rows[0];
    }

    async create(data){
        if(this.#model.name === "Locations"){
            data.map_x = null;
            data.map_y = null;
        }
        
        for(let item of Object.keys(data)){
            if(this.#model.fieldNames.includes(item)) continue;
            throw new Error("Wrong data marked in POST form! Fields in DB Table do not match with Data Object Keys");
        };

        try{
            this.#connection.query(`INSERT INTO ${this.#model.name} SET id = uuid(), ?`, data);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    async update(id, newData){
        for(let item of Object.keys(newData)){
            if(this.#model.fieldNames.includes(item)) continue;
            throw new Error("Wrong data marked in PATCH form! Fields in DB Table do not match with Data Object Keys");
        };

        try{
            this.#connection.query(`UPDATE ${this.#model.name} ${this.#model.pseudo} SET ? WHERE ${this.#model.pseudo}.id = ?`, 
                [newData, id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    async delete(id){
        try{
            this.#connection.query(`DELETE FROM ${this.#model.name} ${this.#model.pseudo} WHERE ${this.#model.pseudo}.id = ?`, [id]);
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }
}