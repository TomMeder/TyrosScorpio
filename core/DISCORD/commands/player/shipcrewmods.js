const util = require('util')
const STRING = OUTPUT["player-info"]

const help = async ( message ) => {
	const embed = {
        title : STRING.shipcrewmodshelp.title,
        description : STRING.shipcrewmodshelp.description,
        color: 0x2A6EBB,
        timestamp: new Date(),
        fields:[{
            name:STRING.shipcrewmodshelp.example.name,
            value:util.format( 
                STRING.shipcrewmodshelp.example.value,
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

        //Parse allycodes
        let allycodes = await Bot.discord.util.allycodes( message )
        if( !allycodes.length ) {
            message.reply(STRING.error.noUser)   
            return help( message )
        } 
        
        
        let unitIndex = await Bot.swapi.units(unit => {
            return {
                name:unit.nameKey,
                defId:unit.baseId,
                combatType: unit.combatType
            }
        })
        
        unitIndex = unitIndex.result
        
        
        // We've got allycode - search it
        
        const conversion = ( player ) => {
            return {
                name: player.name,
                allyCode: player.allyCode,
                level: player.level,
                guildName: player.guildName,

                totalGP: player.stats[0],
                winsShip: player.stats[3],
                winsChar: player.stats[4],
                winsBattle: player.stats[5],
                winsHard: player.stats[6],
                winsGW: player.stats[7],
                winsRaid: player.stats[8],
                contribution: player.stats[9],
                donation: player.stats[10],
                
                characters: player.roster.filter(c => !c.crew.length),
                ships: player.roster.filter(c => c.crew.length),
                
                arena: player.arena,
                

                updated: (new Date(player.updated)).toLocaleString()
            }
        }
        
        //Query swapi for player profiles
        const { result, warning, error } = await Bot.swapi.players( allycodes, conversion )
        

        if( result.length ) { 

            //Echo each result
            result.forEach(async player => {
                
            	
            	  
	            const embed = {
                    title : util.format( STRING.command.shipCrewModsTitle, player.name, player.allyCode ),
                    description : '`------------------------------`\n',
                    color: 0x8B3CB7,
                    footer: {
                      text: STRING.command.updated
                    },
                    timestamp: new Date(player.updated),
                    fields:[]
                }

	            const conversion2 = ( toons ) => {
	                return {
	                    //allyCode: toons.unit.allyCode,
	                    stats: toons
	                    
	                }
	            }
	           
	            const { result, warning, error } = await Bot.swapi.stats(player.allyCode,conversion2)
	            Report.dev( "BOT:stats error?:", error )
	            //Report.dev( "BOT:stats:", result )
	            //let stats = JSON.stringify(result, null, 4);
	            var stats = JSON.parse(JSON.stringify(result));
	            //Report.dev( "BOT:stats2:", stats )
	           
	            //Report.dev( "BOT:unitIndex:", unitIndex )
                
	            let unitIndex_ships = unitIndex.filter(u =>u.combatType === 2);
	            
	            //Report.dev( "BOT:unitIndex_ships:", unitIndex_ships )
	            
	            
	            
	            let adv = {}
	            let field = {
			            name: "*Mods failed (Under Level 15, Under 5★)*",
			            value: " \n",
			            inline:true
			        }
	            
	            var therearefailedmods = false;
	            unitIndex_ships.forEach(s => {
	            	//Phantom2
	            	//s.baseId
	            	//Report.dev( "BOT:Ship:", s.defId )
	            	player.ships.forEach(ship => {
	            		
	            		if(s.defId === ship.defId){
	            			//Report.dev( "BOT:P crew:", ship.crew )
	            			ship.crew.forEach(ship2 => {
	            				
	            				//Sabine
	            				//p2.unitId
	            				//Report.dev( "BOT:unitId:", ship2.unitId )
	            				//Report.dev( "BOT:stats:", stats[0].stats[ship2.unitId].unit.mods )
	            				//&& mods.pips <5
	            				if (stats[0].stats[ship2.unitId].unit.mods.filter(mods => (mods.level < 15 || mods.pips <5)).length > 0){
	            					let toonname = unitIndex.find(ui => ui.defId === ship2.unitId).name
	            					field.value += toonname+"\n";
	            					therearefailedmods=true;
            						//Report.dev( "BOT:Mod failed:", ship2.unitId )
            					}
	            			})
	            		}
	            	})
	            })
	            if(!therearefailedmods){
	            	field.name="*NO Mods failed (Under Level 15, Under 5★)*";
	            	field.value+="Perefct";
	            }
	            
	            
	            embed.fields.push( field )
	            Report.dev( "BOT:embed.fields:", embed.fields.length )
	            embed.description += "\n",
                await Bot.discord.util.reply.swapi(message, embed, {warning:warning, error:error})
            })
            
        } else {
            await Bot.discord.util.reply.swapi(message, null, {warning:[], error:error})
        }
            
    } catch(error) {
        await Bot.discord.util.reply.error(message, error)
    }
    
}



module.exports = {
    help:help,
    command:command
}
