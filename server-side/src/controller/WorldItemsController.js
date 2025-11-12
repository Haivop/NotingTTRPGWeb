export class WorldItemsController{
    #model;
    #modelCRUDHandler;

    constructor(model, CRUDHandler){
        this.#model = model
        this.#modelCRUDHandler = CRUDHandler;
    }

    getCRUDHandler(){
        return this.#modelCRUDHandler;
    };

    async creationPage (req, res) {
        res.status(200).json({
            message: `${this.#model.name} creation page`
        });
    };

    async itemPage (req, res) {
        const id = req.params[Object.keys(req.params)[1]];
        const item = await this.#modelCRUDHandler.getById(id);
        res.status(200).json({
            itemType: this.#model.name,
            item
        });
    };

    async edittingPage(req, res) {
        const id = req.params[Object.keys(req.params)[1]];
        const currentItemData = await this.#modelCRUDHandler.getById(id);
        res.status(200).json({
            message: `${this.#model.name} edit page`,
            currentItemData
        });
    };

    async createItem (req, res) {
        const creationData = req.body;
        creationData.world_id = req.params.worldId;
    
        await this.#modelCRUDHandler.create(creationData);
        res.status(201).json({
            message: `${this.#model.name} created`,
            created: creationData
        });
    };

    async updateItem (req, res) {
        const id = req.params[Object.keys(req.params)[1]];
        const newData = req.body;

        await this.#modelCRUDHandler.update(id, newData);
        res.status(200).json({
            message: `${this.#model.name} data upadated`,
            updatedData : await this.#modelCRUDHandler.getById(id)
        });
    };

    async deleteItem (req, res) {
        const id = req.params[Object.keys(req.params)[1]];

        this.#modelCRUDHandler.delete(id);
        res.status(200).json({
            message: `${this.#model.name} deleted`
        });
    };
}