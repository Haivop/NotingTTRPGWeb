export class GeneralCRUDHandlerModel{
    #model;
    #connection;

    constructor(model){
        this.#model = model
        this.#connection = model.connection;
    };
    
    async getAll(world_id){
        const [rows] = await this.#connection.query(`SELECT ${this.#model.pseudo}.* FROM ${this.#model.name} ${this.#model.pseudo} 
            JOIN Worlds w ON w.id = ?`, [world_id]);
        return rows;
    }

    async getById(id, world_id){
        const [rows] = await this.#connection.query(`SELECT ${this.#model.pseudo}.* FROM ${this.#model.name} ${this.#model.pseudo} 
            JOIN Worlds w ON w.id = ? WHERE ${this.#model.pseudo}.id = ?`, [world_id, id]);
        return rows[0];
    }

    async create(data){
        let preparedValues;
        
        for(item in data){
            preparedValues.concat("?, ");
            if(item === data[Object.keys(data)[Object.keys(data).length - 1]]){
                preparedValues.concat("?");
            };

            if(this.#model.fieldNames.include(item)) continue;
            throw new Error("Wrong data marked in POST form! Fields in DB Table do not match with Data Object Keys");
        };

        try{
            this.#connection.query(`INSERT INTO ${this.#model.name} (id, ${Object.keys(data)}) 
                VALUES (uuid(), ${preparedValues})`, Object.values());
        }
        catch(err){
            console.error("Error occured: " + err);
        }
    }

    async update(id, newData){
        let setQuery;

        for(item in Object.keys(newData)){
            setQuery.concat(`${item} = ?, `);
            if(item === data[Object.keys(data)[Object.keys(data).length - 1]]){
                setQuery.concat(`${item} = ?`);
            };

            if(this.#model.fieldNames.include(item)) continue;
            throw new Error("Wrong data marked in PATCH form! Fields in DB Table do not match with Data Object Keys");
        };

        try{
            this.#connection.query(`UPDATE ${this.#model.name} ${this.#model.pseudo} SET ${setQuery} WHERE ${this.#model.pseudo}.id = ?`, 
                Object.values(newData).concat([id]));
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