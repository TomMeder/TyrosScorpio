const util = require('util')
const STRING = OUTPUT["guild-info"]

const help = async ( message ) => {
	const embed = {
        title : STRING.dsgozetaHelp.title,
        description : STRING.dsgozetaHelp.description,
        color: 0x2A6EBB,
        timestamp: new Date(),
        fields:[{
            name:STRING.dsgozetaHelp.example.name,
            value:util.format( 
                STRING.dsgozetaHelp.example.value,
                message.prefix+message.command,
                message.prefix+message.command,
                message.prefix+message.command
            )
        }]
    }
    message.channel.send({embed})
}


const command = async ( message ) => {
    
    let MESSAGE = null
    
    try {

    	let isList=false;
    	let discord = message.parts.slice(2).filter(i => i.match(/[a-zA-Z]/))
    	 discord = discord.map( d => {
        if( d === 'list' ){ isList=true; return 'list';}
        else{ isList=false; return ''}
    	 }).filter(d => d)
    	 
    	
    	
    	if(isList){
    		const embed = {
                    title : "DeathStarGermanOrder",
                    description : "**Diese Zetas sind Vorgabe**",
                    color: 0x21CF47,
                    footer: {
                      text: STRING.command.updated
                    },
                    timestamp: new Date(),
                    fields:[]
            }
			let fieldline="";
    		coi.forEach(coiDetail => {
                fieldline += getText(coiDetail)+"\n";
        		
        	})    
		
		
            embed.description += "\n`------------------------------`\n"
            let field = {
                name: "Name",
                value: fieldline,
                inline: true
            }
            embed.fields.push(field)
            await Bot.discord.util.reply.swapi(message, embed, {warning:'', error:''}, MESSAGE)                
            MESSAGE = null
            return;
                	
    	}
    	
    	
    	
    	
        //Parse allycodes
        let allycodes = await Bot.discord.util.allycodes( message )
        if( !allycodes.length ) {
            message.reply(STRING.error.noUser)   
            return help( message )
        } 
        
        //Send loading message
        MESSAGE = await Bot.discord.util.loading(message, {
            title:allycodes.length > 1 
                ? util.format(STRING.command.loading.guilds, allycodes.join(", "))
                : util.format(STRING.command.loading.guild, allycodes[0])
        })

        //Query swapi for guild profiles
        const guilds = await Bot.swapi.guilds( allycodes, ( guild ) => {
            return {
                name:guild.name,
                members:guild.roster.map(m => m.allyCode),
                updated: guild.updated
            }
        })
        
        let playerzetas;

        if( guilds.result.length ) { 

            guilds.result.forEach(async guild => {
            
                //Query swapi for guild profiles
                const players = await Bot.swapi.players( guild.members, ( player ) => {
                    return {
                        name: player.name,
                        allyCode: player.allyCode,
                        characters: player.roster.filter(c => !c.crew.length),
                        updated: player.updated
                    }
                })
                  const embed = {
                    title : util.format(STRING.command.zetaTitle, guild.name),
                    description : "**Diese Zetas sind nicht vergeben**",
                    color: 0x21CF47,
                    footer: {
                      text: STRING.command.updated
                    },
                    timestamp: new Date(guild.updated),
                    fields:[]
                }
                
                embed.description += "\n`------------------------------`\n"
                
                
                let gzetas = {}
                players.result.forEach(async player => {
                	
                	let fieldline="";
                	
                    let zetas = player.characters.reduce((acc,a) => {
                        acc.push({name:a.nameKey,zetas:a.skills.filter(s => s.isZeta && s.tier === 8)})
                        return acc
                    },[]).filter(z => z.zetas.length > 0)
                
                	coi.forEach(coiDetail => {
                		let hascoizeta=false;
                		zetas.forEach( z => {
                            z.zetas.forEach( zz => {
                            	if(coiDetail === zz.id){
                            		hascoizeta=true;
                            	}
                            })
                        })
                        if(!hascoizeta){
                        	fieldline += getText(coiDetail)+"\n";  
                        }
                		
                	})
                	if(fieldline !== ""){
                		let field = {
                                name: player.name,
                                value: fieldline,
                                inline: true
                            }
                            embed.fields.push(field)  
                	}
                })
  
                 Report.dev( "BOT:fertig:")
                
                await Bot.discord.util.reply.swapi(message, embed, {warning:guilds.warning, error:guilds.error}, MESSAGE)                
                MESSAGE = null
                
            })
            
        } else {
            await Bot.discord.util.reply.swapi(message, null, {warning:[], error:guilds.error}, MESSAGE)
            MESSAGE = null
        }
            
    } catch(error) {
        await Bot.discord.util.reply.error(message, error, MESSAGE)
    }
    
}

const getText = ( zeta) => {
	
	switch(zeta){
	case "leaderskill_carthonasi" : return "Carth Onasi Leader"; break;
	case "uniqueskill_MOTHERTALZIN01" : return "MT Unique"; break;
	case "uniqueskill_FIRSTORDERTROOPER01" : return "FOST"; break;
	case "uniqueskill_ENFYSNEST01" : return "Enfys Nest"; break;
	case "uniqueskill_ASAJVENTRESS01" : return "Assajj Unique"; break;
	case "uniqueskill_CHEWBACCALEGENDARY01" : return "Chewie (Loyal Friend)"; break;
	case "uniqueskill_YOUNGCHEWBACCA02" : return "Vandor Chewbacca Unique"; break;
	case "uniqueskill_ZAALBAR02" : return "Zaalbar Unique"; break;
	case "uniqueskill_MISSIONVAO02" : return "Mission Vao Unique"; break;
	
	default: return ""; 
	
	
	}
}


const coi = [
	"uniqueskill_FIRSTORDERTROOPER01",
	"uniqueskill_ENFYSNEST01",
	"uniqueskill_CHEWBACCALEGENDARY01",
    "uniqueskill_ASAJVENTRESS01",
    "uniqueskill_MOTHERTALZIN01",
    "uniqueskill_YOUNGCHEWBACCA02",
    "uniqueskill_ZAALBAR02",
    "uniqueskill_MISSIONVAO02"
]





module.exports = {
    help:help,
    command:command
}
