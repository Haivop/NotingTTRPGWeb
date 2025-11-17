import { WorldModel } from "../model/WorldCRUDModel.js";

export async function search(req, res, next){
    const PAGINATION_SIZE = 5;

    let { search, page } = req.query;
    if(page == undefined) page = 1;
    if(search == undefined) search = "";

    const startPaginationIndex = PAGINATION_SIZE * page - 5;
    const endPaginationIndex = PAGINATION_SIZE * page;

    const normilizedSearchTerm = await search.toString().toLowerCase().replace(/\s+/g, "");

    let worlds = await WorldModel.getAllPublic();
    for(let world of worlds){
        const tags = await WorldModel.getTags(world.id);
        world.tags = tags;
    }

    if(worlds == []){
        const error = new Error("Not Found Any Worlds");
        error.status = 404;
        next(error);
    }

    if(search !== "") worlds = await filter(worlds, normilizedSearchTerm);

    const paginatedWorlds = await paginate(worlds, startPaginationIndex, endPaginationIndex);

    res.status(202).json({
        size: PAGINATION_SIZE,
        page,
        paginatedWorlds
    });
}

function paginate(worlds, startPaginationIndex, endPaginationIndex){
    const paginatedWorlds = [];

    for(let i = startPaginationIndex; i < endPaginationIndex; i++){
        if(!worlds[i]) break;
        paginatedWorlds.push(worlds[i]);
    };

    return paginatedWorlds;
}

function filter(worlds, searchQuery){
    return worlds.filter((world) => { 
        const isTagsFound = world.tags.filter((tag) => {
            tag.name.toLowerCase().replace(/\s+/g, "").includes(searchQuery)
        }) == [] ? true : false;

        return world.title.toLowerCase().replace(/\s+/g, "").includes(searchQuery) || 
        world.description.toLowerCase().replace(/\s+/g, "").includes(searchQuery) ||
        isTagsFound;
    });
}
    