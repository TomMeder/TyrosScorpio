module.exports = async ( allycode, conversion ) => {
    
    return await swapi.response({
        method:'stats',
        allycode:allycode,
        language:Bot.config.swapi.api.language
    }, conversion )
    
}
