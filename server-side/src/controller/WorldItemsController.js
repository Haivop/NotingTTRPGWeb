import { GeneralCRUDHandlerModel } from "../model/GeneralCRUDHandlerModel.js";

export class WorldItemsController{
    #model;
    #modelCRUDHandler;

    constructor(model){
        this.#model = model;
        this.#modelCRUDHandler = new GeneralCRUDHandlerModel(model);
    }

    creationPage (req, res) {
        res.status(200).json({
            message: `${this.#model.name} creation page`
        });
    }

    itemPage (req, res) {
        const { worldId, id } = req.params;
        res.status(200).json({
            itemType: this.#model.name,
            item: this.#modelCRUDHandler.getById(id, worldId)
        });
    }

    edittingPage(req, res) {
        const { worldId, id } = req.params;
        res.status(200).json({
            message: `${this.#model.name} edit page`,
            currentItemData: modelCRUDHandler.getById(id, worldId)
        });
    }

    createItem (req, res) {
        const creationData = req.body;
        creationData.world_id = { worldId } = req.params;
    
        this.#modelCRUDHandler.create(creationData);
        res.status(201).json({
            message: `${this.#model.name} created`,
            created: creationData
        });
    }

    updateItem (req, res) {
        const { worldId, id } = req.params;
        const newData = req.body;

        this.#model.update(id, newData);

        res.status(200).json({
            message: `${this.#model.name} data upadated`,
            updatedData : this.#model.getById(id, worldId)
        });
    }

    deleteItem (req, res) {
        this.#model.delete(req.params.id);
        res.status(200).json({
            message: `${this.#model.name} deleted`
        });
    }
}