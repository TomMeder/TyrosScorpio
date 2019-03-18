const util = require('util')
const STRING = OUTPUT["player-info"]

const help = async ( message ) => {
	const embed = {
        title : STRING.tihelp.title,
        description : STRING.tihelp.description,
        color: 0x2A6EBB,
        timestamp: new Date(),
        fields:[{
            name:STRING.tihelp.example.name,
            value:util.format( 
                STRING.tihelp.example.value,
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

    	 let squadName = message.parts.slice(2).filter(i => !Number(i) && !i.match(/\d{17,18}/) && i !== 'me')
         if( !squadName.length ) { 
             return message.reply(STRING.error.noSquad)
         }
    	 Report.dev( "BOT:squadName:", squadName )
    	
        //Parse allycodes
        let allycodes = await Bot.discord.util.allycodes( message )
        if( !allycodes.length ) {
            message.reply(STRING.error.noUser)   
            return help( message )
        } 
        
        
        let unitIndex = await Bot.swapi.units(unit => {
            return {
                name:unit.nameKey,
                defId:unit.baseId
            }
        })
        
        unitIndex = unitIndex.result
        Report.dev( "BOT:unitIndex length:", unitIndex.length )
        
        
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
                    title : util.format( STRING.command.title, player.name, player.allyCode ),
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
	            Report.dev( "BOT:stats warning?:", warning )
	            //Report.dev( "BOT:stats:", result )
	            //let stats = JSON.stringify(result, null, 4);
	            var stats = JSON.parse(JSON.stringify(result));
	            //Report.dev( "BOT:stats2:", stats )
	            
	            let squads;
	            
	            let label_speed ="**Speed**: ";
	            let label_tenacity ="**Tenacity**: ";
	            let label_health ="**Health**: ";
	            let label_protection ="**Protection**: ";
	            let label_physicaldamage ="**Physical Damage**: ";
	            let label_specialdamage ="**Special Damage**: ";
	            let label_armor ="**Armor**: ";
	            let label_potency ="**Potency**: ";
	            let label_critchance = "**Physical Critical Chance**: ";
	            let label_critdamage = "**Critical Damage**: ";
	            
	            let squadknown = true;
	            let known_squads = "BH, NS, FO, Scoundrels, Revan, Traya, CLS, Rex, Rebels, Zaul, Imps -- oder speed, tenacity, potency, armor, health, damage, specialdamage, critdamage, critchance, protection,critavoidance ";
	            
	            
	            squadName = squadName.toLocaleString().toLowerCase().split(',');
	            Report.dev( "BOT:squadName:", squadName )
	            
	            
	            if(squadName.includes('bh')||squadName.includes('bossk')){
	            	

	            	let charname="BOSSK";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,305)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),100)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
        			field.value += label_armor+(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Armor,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2),40)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );
	            	
        			charname="ZAMWESELL";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,280)+"\n";
	            	field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),60)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

	            	
	            	charname="JANGOFETT";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,279)+"\n";
	            	field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),70)+"\n";
	            	field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

	            	charname="BOBAFETT";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,280)+"\n";
	            	field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
	            	field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),50)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="DENGAR";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
	            	field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),70)+"\n";
	            	field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),50)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
	            	
	            }
	            else if(squadName.includes('fo')||squadName.includes('kru')){
	            	

	            	let charname="KYLORENUNMASKED";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	Report.dev( "BOT:displayed_toon1:", displayed_toon )
	            	
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,210)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),80)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,50000)+"\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="KYLOREN";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	 Report.dev( "BOT:displayed_toon2:", displayed_toon )
	            	
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,220)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
        			field.value += label_armor+(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Armor,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2),50)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="FIRSTORDEREXECUTIONER";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,200)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="FIRSTORDERTROOPER";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,180)+"\n";
	            	field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),50)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,35000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			
        			charname="FIRSTORDEROFFICERMALE";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,230)+"\n";
	            	field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,25000)+"\n";
        			field.value += label_specialdamage+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="BARRISSOFFEE";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,48000)+"\n";
        			
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        		
	            	
	            }
	            else if(squadName.includes('ns')){
	            	

	            	let charname="ASAJVENTRESS";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,180)+"\n";
        			field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
        			field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),40)+"\n";
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="MOTHERTALZIN";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,210)+"\n";
        			field.value += "**Potency**: "+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),80)+"\n";
            		field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],2500)+"\n";
            		field.value += label_specialdamage+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Special Damage"],5500)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="DAKA";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,210)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,38000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="NIGHTSISTERZOMBIE";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,200)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,25000)+"\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,35000)+"\n";
        			field.value += label_specialdamage+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			
        			
        			charname="NIGHTSISTERSPIRIT";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,200)+"\n";
	            	field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],2500)+"\n";
            		field.value += label_specialdamage+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Special Damage"],2500)+"\n";field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="NIGHTSISTERACOLYTE";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,180)+"\n";
        			field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
        			field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),40)+"\n";
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="TALIA";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
	            	
	            }
	            else if(squadName.includes('Scoundrels')||squadName.includes('scoundrels')||squadName.includes('qira')){
	            	

	            	let charname="QIRA";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,245)+"\n";
        			field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),100)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="YOUNGCHEWBACCA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,200)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,45000)+"\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="ZAALBAR";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,170)+"\n";
	            	field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),120)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="MISSIONVAO";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,170)+"\n";
	            	field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3500)+"\n";
	            	field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			
        			
        			charname="L3_37";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="ENFYSNEST";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
	            	
	            }


	            else if(squadName.includes('revan')){
	            	

	            	let charname="JEDIKNIGHTREVAN";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,310)+"\n";
        			field.value += label_specialdamage+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Special Damage"],5000)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="JOLEEBINDO";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,240)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
        			field.value += label_armor+(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Armor,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2),50)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="GRANDMASTERYODA";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
	            	field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,35000)+"\n";
        			field.value += label_specialdamage+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Special Damage"],7000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
	            	charname="GENERALKENOBI";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,245)+"\n";
	            	field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,35000)+"\n";
	            	field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,65000)+"\n";
        			field.value += label_armor+(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Armor,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2),50)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="EZRABRIDGERS3";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,240)+"\n";
	            	field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3800)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
	            }
	            else if(squadName.includes('traya')){
	            	

	            	let charname="DARTHTRAYA";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,210)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),120)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
        			field.value += label_armor+(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Armor,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2),50)+"\n";
        			
        			let modscriticalavoidance=0;
        			if(stats[0].stats[charname].unit.mods[1].stat[0][0]===54){
        				modscriticalavoidance=stats[0].stats[charname].unit.mods[1].stat[0][1];
        			}
        			field.value += '**Crit Avoidance:** '+(displayNumber(modscriticalavoidance,1,2))+"%"+display_cross_check(displayNumber(modscriticalavoidance,1,2),35)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="DARTHSION";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,290)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="DARTHNIHILUS";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,240)+"\n";
	            	field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),100)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="BASTILASHANDARK";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,240)+"\n";
	            	field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),100)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="GRANDADMIRALTHRAWN";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,289)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
	            	
	            }
	            else if(squadName.includes('cls')||squadName.includes('luke')){
	            	

	            	let charname="COMMANDERLUKESKYWALKER";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="HANSOLO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
	            	field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3500)+"\n";
	            	field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),20)+"\n";
	            	field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
	            	field.value += label_physicaldamage+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),65)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="CHEWBACCALEGENDARY";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],4500)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="OLDBENKENOBI";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,230)+"\n";
	            	field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
	            	field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),60)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
	            	
	            }
	            
	            else if(squadName.includes('rex')||squadName.includes('wampa')){
	            	

	            	let charname="CT7567";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="WAMPA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
	            	field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3500)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="SUNFAC";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="STORMTROOPERHAN";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
        			field.value += label_specialdamage+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="HOTHHAN";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
        			field.value += label_specialdamage+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
	            	
	            }
	            else if(squadName.includes('bast')||squadName.includes('shan')){
	            	

	            	let charname="BASTILASHAN";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="EZRABRIDGERS3";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="HERMITYODA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
	            	
	            }
	            else if(squadName.includes('rebels')){
	            	

	            	let charname="WEDGEANTILLES";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="BIGGSDARKLIGHTER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="STORMTROOPERHAN";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
	            	
	            }
	            else if(squadName.includes('zaul')){
	            	

	            	let charname="MAUL";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="SITHTROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="SAVAGEOPRESS";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field );
	            	
	            }
            	else if(squadName.includes('imps')){
	            	

	            	let charname="COLONELSTARCK";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			let speed_starck=stats[0].stats[charname].stats.final.Speed;
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,270)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="SNOWTROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,displayNumber(((speed_starck+20)*0.6)-20,1,2))+"\n";
	            	field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
	            	field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),60)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="RANGETROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,displayNumber(((speed_starck+20)*0.8)-20,1,2))+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="SHORETROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,displayNumber(((speed_starck+20)*0.7)-20,1,2))+"\n";
	            	field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,45000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="VEERS";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,displayNumber(((speed_starck+20)*0.7)-20,1,2))+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
	            	
	            }
            	else if(squadName.includes('jtr')){
	            	

	            	let charname="REYJEDITRAINING";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			let speed_starck=stats[0].stats[charname].stats.final.Speed;
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,240)+"\n";
                    field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
                    field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="BB8";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,276)+"\n";
	            	field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),40)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="C3POLEGENDARY";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,255)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="R2D2_LEGENDARY";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,274)+"\n";
	            	field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,30000)+"\n";
	            	field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),40)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="T3_M4";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,220)+"\n";
	            	field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),60)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="CHOPPERS3";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,50000)+"\n";
	            	field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,30000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="SCARIFREBEL";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
	            	field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,60000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
	            	
	            }
        		else if(squadName.includes('speed')){
	            	

	            	let charname="JEDIKNIGHTREVAN";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,305)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="ENFYSNEST";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,300)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="BOSSK";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,280)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="GRANDMASTERYODA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,275)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="HERMITYODA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,270)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="GENERALKENOBI";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,235)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="JOLEEBINDO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,230)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="OLDBENKENOBI";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,235)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="BOBAFETT";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,245)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="QIRA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,245)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="CHEWBACCALEGENDARY";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,245)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="MOTHERTALZIN";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,240)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        				
        			
        			charname="VADER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,245)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="GRANDMOFFTARKIN";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,195)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="BB8";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,270)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="JANGOFETT";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,275)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="R2D2_LEGENDARY";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,270)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="BARRISSOFFEE";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,215)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

	            	
	            }
        		else if(squadName.includes('potency')){
	            	

	            	let charname="BASTILASHANDARK";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),100)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="VADER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),85)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="GRANDMOFFTARKIN";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),100)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="EMPERORPALPATINE";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),85)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="DAKA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),90)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="DENGAR";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),70)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="HANSOLO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),20)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="B2SUPERBATTLEDROID";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_potency+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),90)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
	            	
	            }
        		else if(squadName.includes('tenacity')){
	            	

	            	let charname="BOSSK";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),100)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="MAGMATROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),120)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="ZAALBAR";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),140)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="DARTHTRAYA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),120)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="CANDEROUSORDO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%) "+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),120)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
	            	
	            }
        		else if(squadName.includes('armor')){
	            	

	            	let charname="KYLORENUNMASKED";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_armor+(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Armor,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2),50)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="ZAALBAR";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_armor+(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Armor,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2),50)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
	            	
        			charname="GENERALKENOBI";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_armor+(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Armor,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2),50)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="L3_37";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_armor+(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Armor,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2),55)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="JOLEEBINDO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_armor+(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Armor,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Armor,100,2),50)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
	            	
	            }
        		else if(squadName.includes('protection')){
	            	

	            	let charname="BAZEMALBUS";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,50000)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="SITHTROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,60000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="GENERALKENOBI";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,65000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="ZAALBAR";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,65000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="L3_37";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,65000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
	            	
	            }
        		else if(squadName.includes('health')){
	            	

	            	let charname="KYLORENUNMASKED";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,50000)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="BARRISSOFFEE";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,50000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="FIRSTORDERTROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="FIRSTORDEREXECUTIONER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,35000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="ENFYSNEST";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="SHORETROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,45000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
        			charname="NIGHTSISTERZOMBIE";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			
        			charname="DAKA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,35000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			
        			charname="YOUNGCHEWBACCA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,48000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="GENERALKENOBI";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,35000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="OLDBENKENOBI";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="SITHTROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,35000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="R2D2_LEGENDARY";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,35000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="BOSSK";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="ZAALBAR";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="L3_37";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="BASTILASHAN";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="KYLOREN";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,35000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="JOLEEBINDO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			
        			charname="GRANDMASTERYODA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,35000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			charname="DARTHTRAYA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,40000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			
        			
        			

	            }
        		else if(squadName.includes('damage')){
	            	

	            	let charname="CHEWBACCALEGENDARY";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],4500)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="WAMPA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],4000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="EZRABRIDGERS3";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="ASAJVENTRESS";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="REYJEDITRAINING";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="SNOWTROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3800)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="NIGHTSISTERSPIRIT";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],4000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="HANSOLO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3300)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="MISSIONVAO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_physicaldamage+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3800)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        		
	            	
	            }
    			else if(squadName.includes('critavoidance')){
	            	

	            	let charname="BAZEMALBUS";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    let modscriticalavoidance=0;
        			if(stats[0].stats[charname].unit.mods[1].stat[0][0]===54){
        				modscriticalavoidance=stats[0].stats[charname].unit.mods[1].stat[0][1];
    				}
        			field.value += '**Crit Avoidance:** '+(displayNumber(modscriticalavoidance,1,2))+"%"+display_cross_check(displayNumber(modscriticalavoidance,1,2),35)+"\n";
        			field.value += display_line();
	            	embed.fields.push( field );

	            	charname="ZAALBAR";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			modscriticalavoidance=0;
        			if(stats[0].stats[charname].unit.mods[1].stat[0][0]===54){
        				modscriticalavoidance=stats[0].stats[charname].unit.mods[1].stat[0][1];
    				}
        			field.value += '**Crit Avoidance:** '+(displayNumber(modscriticalavoidance,1,2))+"%"+display_cross_check(displayNumber(modscriticalavoidance,1,2),35)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="SITHTROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			modscriticalavoidance=0;
        			if(stats[0].stats[charname].unit.mods[1].stat[0][0]===54){
        				modscriticalavoidance=stats[0].stats[charname].unit.mods[1].stat[0][1];
    				}
        			field.value += '**Crit Avoidance:** '+(displayNumber(modscriticalavoidance,1,2))+"%"+display_cross_check(displayNumber(modscriticalavoidance,1,2),35)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="DARTHTRAYA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			modscriticalavoidance=0;
        			if(stats[0].stats[charname].unit.mods[1].stat[0][0]===54){
        				modscriticalavoidance=stats[0].stats[charname].unit.mods[1].stat[0][1];
    				}
        			field.value += '**Crit Avoidance:** '+(displayNumber(modscriticalavoidance,1,2))+"%"+display_cross_check(displayNumber(modscriticalavoidance,1,2),35)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="KYLORENUNMASKED";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			modscriticalavoidance=0;
        			if(stats[0].stats[charname].unit.mods[1].stat[0][0]===54){
        				modscriticalavoidance=stats[0].stats[charname].unit.mods[1].stat[0][1];
    				}
        			field.value += '**Crit Avoidance:** '+(displayNumber(modscriticalavoidance,1,2))+"%"+display_cross_check(displayNumber(modscriticalavoidance,1,2),35)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
	            	
	            }
	          
    			
    		
    			
	            
	            
        		else if(squadName.includes('specialdamage')){
	            	

	            	let charname="JEDIKNIGHTREVAN";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_specialdamage+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Special Damage"],5000)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="MOTHERTALZIN";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_specialdamage+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Special Damage"],5800)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="DARTHTRAYA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_specialdamage+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Special Damage"],5500)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			
	            	
	            }
        		else if(squadName.includes('critdamage')){
	            	

	            	let charname="FIRSTORDEREXECUTIONER";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );
	            	
	            	charname="ASAJVENTRESS";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );


	            	charname="WAMPA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="REYJEDITRAINING";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

	            	charname="SNOWTROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
	            	charname="MISSIONVAO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_critdamage+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),186)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );

        			
	            	

	            	
	            }
        		else if(squadName.includes('critchance')){
	            	

	            	let charname="DENGAR";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),50)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field );

	            	charname="R2D2_LEGENDARY";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),40)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="SNOWTROOPER";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),60)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="HANSOLO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),65)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="MISSIONVAO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),60)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
        			charname="CARTHONASI";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_critchance+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),65)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field );
        			
	            	
	            }
            	else{
	            	squadknown = false;
	            	
	            	
	            }
	            
	            if(squadknown){
	            	await Bot.discord.util.reply.swapi(message, embed, {warning:warning, error:error})
	            }
	            else{
	            	let error = {message:'No known squad, use '+known_squads};
	            	 Report.dev( "BOT:error:", error )
	            	await Bot.discord.util.reply.error(message, error, MESSAGE)
	                MESSAGE = null
	            }
            })
            
        } else {
            await Bot.discord.util.reply.swapi(message, null, {warning:[], error:error})
        }
            
    } catch(error) {
        await Bot.discord.util.reply.error(message, error)
    }
    
}

const display_line = () => {
	return "------------------------------------------------\n";
}


const display_cross_check = (value,mark) => {
	let check_value = Number(value);
	let check_mark = Number(mark);
	Report.dev( "BOT:check_value:", check_value )
	Report.dev( "BOT:check_mark:", check_mark )
	if(check_value>=check_mark){
		return  " ✓ ["+check_mark+"]";
	}
	return ":x: **["+check_mark+"]**";
	
}

const displayNumber = ( value,multiplicator, precision) => {
	var x = Number(value);
	x=x*multiplicator;
	x=x.toFixed(precision);
	return x.toString();
}
const displaytoon_bold = ( toon,unitIndex,defId) => {
	return displaytoon(toon,unitIndex,defId,"**");
}

const displaytoon = ( toon,unitIndex,defId,bold ) => {
	let unitname = unitIndex.find(ui => ui.defId === defId).name;
	Report.dev( "BOT:unitname:", unitname )
	
	let field = {
            name: bold+ unitname+bold,
            value: "\n",
            inline:true
        }

	 field.value += "★".repeat(toon.rarity)+"☆".repeat(7 - toon.rarity)+" **| "
     field.value += "L"+toon.level+" | "
     field.value += "G"+toon.gear+" "
     
    
     let dots = toon.equipped.reduce((dots,d) => {
         dots[d.slot] = 1
         return dots
     },[0,0,0,0,0,0]).join("")
     field.value += Bot.swapi.util.mod.dots[dots.toString()]+"**\n"
     
     //Report.dev( "BOT:toon.skills:", toon.skills )
 	
     toon.skills.forEach(async skill => {
    	 
    	 if(skill.isZeta){
    		 field.value +="*"+skill.nameKey+"* "+(skill.isZeta ? skill.tier === 8 ? "✦" : "⟡" : "")+"\n"
    	 }
    	 
     })
     field.value +="	           "
    	
    return field;
}


module.exports = {
    help:help,
    command:command
}
