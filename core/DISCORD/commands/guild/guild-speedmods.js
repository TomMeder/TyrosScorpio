const util = require('util')
const STRING = OUTPUT["guild-info"]

const help = async ( message ) => {
	const embed = {
        title : STRING.speedModsHelp.title,
        description : STRING.speedModsHelp.description,
        color: 0x2A6EBB,
        timestamp: new Date(),
        fields:[{
            name:STRING.speedModsHelp.example.name,
            value:util.format( 
                STRING.speedModsHelp.example.value,
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

    	let is6e=false;
    	let params=[];
    	
    	let discord = message.parts.slice(2).filter(i => i.match(/[0-9a-zA-Z]/))
    	 discord = discord.map( d => {
    		 params.push(d);
        if( d === '6e' ){ is6e=true; return 'is6e';}
        else{ is6e=false; return ''}
    	 }).filter(d => d)
    	 
        //Parse allycodes
        let allycodes = await Bot.discord.util.allycodes( message )
        if( !allycodes.length ) {
            message.reply(STRING.error.noUser)   
            return help( message )
        }
    	let speedvalue=0;
    	if( params.length === 1) {
    		speedvalue=20;
        } 
    	if( params.length === 2) {
    		if(params[1] >0 && params[1]<33){
    			speedvalue=params[1];
    		}
    		else{
    			speedvalue=20;
    		}
        } 
    	 Report.dev( "BOT:speedvalue:"+speedvalue);
        
    	
    	
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
                    description : "",
                    color: 0x21CF47,
                    footer: {
                      text: STRING.command.updated
                    },
                    timestamp: new Date(guild.updated),
                    fields:[]
                }
                
                embed.description += "\n`------------------------------`\n"
                
                
                	
                if(is6e){
                	let field = {
                            name:  "**6E Speedmods**",
                            value: "",
                            inline: true
                        }
                        field.value +="\n`------------------------------`\n"
                        
                        	
                        let result_speedmods ="["; 
                        	
                        //let firstHalf = players.result.splice(0,Math.ceil(players.result.length / 2))
                        
                        players.result.forEach(async player => {
                        	 let speedmods_count=0;
                        	 let allmods = player.characters.reduce((acc,a) => {
                                 acc.push({charname:a.nameKey,mods:a.mods.filter(s => s.pips == 6)})
                                 return acc
                             },[]).filter(z => z.mods.length > 0)
                             allmods.forEach( char => {
                            	 
                            	 char.mods.forEach( m => {
                            		 speedmods_count++;
                            		
                            	 })
                             })
                        	 result_speedmods+='{"count": '+speedmods_count+', "name":  "'+player.name+'"},';
                             
                               
                            
                             
                        })
                        result_speedmods=result_speedmods.substring(0,result_speedmods.length-1);
                        result_speedmods+="]";
                        let result_json = JSON.parse(result_speedmods);
                        
                        result_json .sort( function( a, b )
                        		{
                        		  if ( a.count == b.count ) return 0;
                        		  return ( a.count > b.count ) ? 1 : -1;
                        		}).reverse();
                        
                        
                        
                        let firstHalf =result_json.splice(0,Math.ceil(result_json.length / 2))
                        
                        for (i in firstHalf)
                        {
                        	field.value += firstHalf[i].name+" Anzahl: "+firstHalf[i].count+"\n"
                        }
                        embed.fields.push(field)  
                        
                        field = {
                            name:  "**6E Speedmods**",
                            value: "",
                            inline: true
                        }
                        field.value +="\n`------------------------------`\n"
                        	
                        for (i in result_json)
                        {
                        	field.value += result_json[i].name+" Anzahl: "+result_json[i].count+"\n"
                        }
                        
                        embed.fields.push(field)  
                }else{
                	let field = {
                            name:  "**+"+speedvalue+" Speedmods**",
                            value: "",
                            inline: true
                        }
                        field.value +="\n`------------------------------`\n"
                        
                        	
                        let result_speedmods ="["; 
                        	
                        //let firstHalf = players.result.splice(0,Math.ceil(players.result.length / 2))
                        
                        players.result.forEach(async player => {
                        	 let speedmods_count=0;
                        	 let allmods = player.characters.reduce((acc,a) => {
                                 acc.push({charname:a.nameKey,mods:a.mods.filter(s => s.slot == 1 || s.slot > 2)})
                                 return acc
                             },[]).filter(z => z.mods.length > 0)
                             allmods.forEach( char => {
                            	 
                            	 char.mods.forEach( m => {
                            		 let speed_secondaries = m.secondaryStat.filter(secondary => secondary.unitStat === 5);
                            		 
                            		 speed_secondaries.forEach (spesec => {
                            			 if(spesec.value >=speedvalue){
                            				 speedmods_count++; 
                            			 }	 
                            		 })
                            	 })
                             })
                        	 result_speedmods+='{"count": '+speedmods_count+', "name":  "'+player.name+'"},';
                             
                               
                            
                             
                        })
                        result_speedmods=result_speedmods.substring(0,result_speedmods.length-1);
                        result_speedmods+="]";
                        let result_json = JSON.parse(result_speedmods);
                        
                        result_json .sort( function( a, b )
                        		{
                        		  if ( a.count == b.count ) return 0;
                        		  return ( a.count > b.count ) ? 1 : -1;
                        		}).reverse();
                        
                        
                        
                        let firstHalf =result_json.splice(0,Math.ceil(result_json.length / 2))
                        
                        for (i in firstHalf)
                        {
                        	field.value += firstHalf[i].name+" Anzahl: "+firstHalf[i].count+"\n"
                        }
                        embed.fields.push(field)  
                        
                        field = {
                            name:  "**+"+speedvalue+" Speedmods**",
                            value: "",
                            inline: true
                        }
                        field.value +="\n`------------------------------`\n"
                        	
                        for (i in result_json)
                        {
                        	field.value += result_json[i].name+" Anzahl: "+result_json[i].count+"\n"
                        }
                        
                        embed.fields.push(field)  
                	
                	
                }
                	
                	
                	
                
  
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
