import { WorldModel } from "../model/WorldCRUDModel";

export async function search(req, res, next){
    const PAGINATION_SIZE = 5;
    const { search, page } = req.query;
    const startPaginationIndex = PAGINATION_SIZE * page;
    const endPaginationIndex = PAGINATION_SIZE * page + 5;

    if(page == null) page = 0;
    if(search == null) search = "";

    const normilizedSearchTerm = search.toLowerCase().replace(/\s+/g, "");

    const worlds = await WorldModel.getAllPublic();
    for(let world of worlds){
        const tags = WorldModel.getTags(world.id);
        world.tags = tags;
    }

    if(page == null && search == null){
        res.status(202).json({
            worlds
        })
    }
        
    if(worlds == []){
        const error = new Error("Not Found Any Worlds");
        error.status = 404;
        next(error);
    }

    worlds.filter((world) => { 
        const isTagsFound = world.tags.filter((tag) => {tag.name.toLowerCase().replace(/\s+/g, "").includes(normilizedSearchTerm)}) == [] ? false : true

        return world.title.toLowerCase().replace(/\s+/g, "").includes(normilizedSearchTerm) || 
        world.description.toLowerCase().replace(/\s+/g, "").includes(normilizedSearchTerm) ||
        isTagsFound;
    });

    const paginatedWorlds = [];

    for(let i = startPaginationIndex - 1; i < endPaginationIndex - 1; i++){
        paginatedWorlds.push(worlds[i]);
    }

    res.status(202).json({
        size: PAGINATION_SIZE,
        page,
        paginatedWorlds
    })
}