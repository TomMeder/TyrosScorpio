const util = require('util')
const STRING = OUTPUT["player-info"]

const help = async ( message ) => {
	const embed = {
        title : STRING.help.title,
        description : STRING.help.description,
        color: 0x2A6EBB,
        timestamp: new Date(),
        fields:[{
            name:STRING.help.example.name,
            value:util.format( 
                STRING.help.example.value,
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
	            //Report.dev( "BOT:stats:", result )
	            //let stats = JSON.stringify(result, null, 4);
	            var stats = JSON.parse(JSON.stringify(result));
	            //Report.dev( "BOT:stats2:", stats )
	            
	            let squads;
	            
	            let label_speed ="**Speed**: ";
	            let label_tenacity ="**Tenacity**: ";
	            let label_health ="**Health**: ";
	            let label_protection ="**Protection**: ";
	            
	            
	            /*
	            let outputmessage = {
	                    name: "**Counter**",
	                    value: "\n",
	                    inline:true
	                }

	            outputmessage.value += ":small_red_triangle_down:CLS: Nightsisters(H), Rex(S)\n"
	            outputmessage.value += ":small_red_triangle_down:KRU: CLS/Ewoks(H), zFinn(S)\n"
	            outputmessage.value += ":small_red_triangle_down:BH: ImpT/Bast/EP(H), CLS/KRU(S)\n"
	            outputmessage.value += ":small_red_triangle_down:NS: EP/ImpT(H), Jango/zzPhoenix(S)\n"
	            outputmessage.value += ":small_red_triangle_down:Bast: NS(H), KRU(S)\n"
	            outputmessage.value += ":small_red_triangle_down:Revan: Revan/Traya(H), NS(S)\n"
	            
            	outputmessage.value += ":small_red_triangle_down:Scoundrels: JTR/Jango(H), NS(S)\n"
 	            outputmessage.value += ":small_red_triangle_down:JTR: NS(H), GAT+ImpT(S)\n"
 	            outputmessage.value += ":small_red_triangle_down:EP: RexWampa/Bast(H)\n"
 	            outputmessage.value += ":small_red_triangle_down:Ewoks: RexWampa/zzPhoenix(H)\n"
 	            outputmessage.value += ":small_red_triangle_down:Phoenix: EP(H), Ewoks(S)\n"
 	            outputmessage.value += ":small_red_triangle_down:Zaul: BH/zzPhoenix(H), Rex(S)\n"
 	            outputmessage.value += ":small_red_triangle_down:Traya: CLS/EP(H), KRU/zFinn(S)\n"
	     	            
	            embed.fields.push( outputmessage )
	            
	            squadName=''
	            */
	            squadName = squadName.toLocaleString().toLowerCase().split(',');
	            
	            
	            if(squadName.includes('bh')|| squadName.includes('bossk')){
	            	
	            	let squadsize=0;
	            	
	            	
	            	
	            	
        			let field = {
        		            name: '**BH Counter**',
        		            value: "\n",
        		            inline:true
        		        }

        		     field.value +="	           ";
        			field.value += display_line();
        			let charname="BASTILASHAN";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let good = checkToonFull(displayed_toon[0]);
        			let zetarequired = checkZeta(displayed_toon[0],"leaderskill_BASTILASHAN");
        			let toonstats = getToonStats(stats[0].stats[charname].stats.final);
        			
        			
        			if(good && zetarequired && ((toonstats.Speed >200)&&(toonstats.Speed >200)&&(toonstats.Speed >200))){
        					field.value +='**'+getUnitName(unitIndex,charname)+'**\n';
        			} 
        			
                    
	            	

	            	charname="HERMITYODA";
	            	
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			good = checkToonFull(displayed_toon[0]);
        			zetarequired = checkZeta(displayed_toon[0],"specialskill_HERMITYODA02");
        			toonstats = getToonStats(stats[0].stats[charname].stats.final);
        			if(good && zetarequired && ((toonstats.Speed >200)&&(toonstats.Speed >200)&&(toonstats.Speed >200))){
    					field.value +='**'+getUnitName(unitIndex,charname)+'**\n';
        			} 
        			
        			

        			charname="EZRABRIDGERS3";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			good = checkToonFull(displayed_toon[0]);
        			zetarequired = checkZeta(displayed_toon[0],"specialskill_EZRABRIDGERS301");
        			toonstats = getToonStats(stats[0].stats[charname].stats.final);
        			if(good && zetarequired && ((toonstats.Speed >200)&&(toonstats.PhysicalDamage >2000))){
    					field.value +='**'+getUnitName(unitIndex,charname)+'**\n';
        			} 
        			
        			embed.fields.push( field )
        			
        		
        			
	            	
	            	
	            }
            	if(squadName.includes('fo')||squadName.includes('FO')||squadName.includes('kru')||squadName.includes('KRU')){
	            	

	            	let charname="KYLORENUNMASKED";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	Report.dev( "BOT:displayed_toon1:", displayed_toon )
	            	
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,210)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),80)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,35000)+"\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
	            	embed.fields.push( field )

	            	charname="KYLOREN";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	 Report.dev( "BOT:displayed_toon2:", displayed_toon )
	            	
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,220)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
        			field.value += "**Physical Damage**: "+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field )

        			charname="FIRSTORDEREXECUTIONER";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,200)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += "**Physical Damage**: "+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="FIRSTORDERTROOPER";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,180)+"\n";
	            	field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2),50)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,35000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field )

        			
        			charname="FIRSTORDEROFFICERMALE";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,230)+"\n";
	            	field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,25000)+"\n";
        			field.value += "**Special Damage**: "+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="BARRISSOFFEE";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        		
	            	
	            }
        		if(squadName.includes('ns')||squadName.includes('NS')){
	            	

	            	let charname="ASAJVENTRESS";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,180)+"\n";
        			field.value += "**Critical Damage**: "+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
        			field.value += "**Physical Critical Chance**: "+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),40)+"\n";
        			field.value += "**Physical Damage**: "+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
	            	field.value += display_line();
	            	embed.fields.push( field )

	            	charname="MOTHERTALZIN";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,210)+"\n";
        			field.value += "**Potency**: "+(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Potency,100,2))+"%)"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final.Potency,100,2),80)+"\n";
            		field.value += "**Physical Damage**: "+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],2500)+"\n";
            		field.value += "**Special Damage**: "+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Special Damage"],5000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field )

        			charname="DAKA";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,210)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,35000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="NIGHTSISTERZOMBIE";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,200)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")"+display_cross_check(stats[0].stats[charname].stats.final.Health,25000)+"\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")"+display_cross_check(stats[0].stats[charname].stats.final.Protection,35000)+"\n";
        			field.value += "**Special Damage**: "+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			
        			
        			
        			charname="NIGHTSISTERSPIRIT";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,200)+"\n";
	            	field.value += "**Physical Damage**: "+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],2500)+"\n";
            		field.value += "**Special Damage**: "+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Special Damage"],2500)+"\n";field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="NIGHTSISTERACOLYTE";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,180)+"\n";
        			field.value += "**Critical Damage**: "+(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Critical Damage"],100,2),216)+"\n";
        			field.value += "**Physical Critical Chance**: "+(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2))+"%"+display_cross_check(displayNumber(stats[0].stats[charname].stats.final["Physical Critical Chance"],100,2),40)+"\n";
        			field.value += "**Physical Damage**: "+stats[0].stats[charname].stats.final["Physical Damage"]+" (+"+stats[0].stats[charname].stats.mods["Physical Damage"]+")"+display_cross_check(stats[0].stats[charname].stats.final["Physical Damage"],3000)+"\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="TALIA";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
	            	
	            }
        		if(squadName.includes('Scoundrels')||squadName.includes('scoundrels')||squadName.includes('qira')){
	            	

	            	let charname="QIRA";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,200)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
	            	embed.fields.push( field )

	            	charname="YOUNGCHEWBACCA";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,200)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )

        			charname="ZAALBAR";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,170)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="MISSIONVAO";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,170)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
        			field.value += "**Special Damage**: "+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			
        			
        			
        			charname="L3_37";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="ENFYSNEST";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
	            	
	            }


	            if(squadName.includes('revan')||squadName.includes('REVAN')){
	            	

	            	let charname="JEDIKNIGHTREVAN";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
	            	embed.fields.push( field )

	            	charname="GENERALKENOBI";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )

        			charname="JOLEEBINDO";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="GRANDMASTERYODA";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
        			field.value += "**Special Damage**: "+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
	            	
        			
        			charname="HERMITYODA";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
	            	
	            }
	            if(squadName.includes('traya')||squadName.includes('TRAYA')){
	            	

	            	let charname="DARTHTRAYA";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
	            	embed.fields.push( field )

	            	charname="DARTHSION";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )

        			charname="DARTHNIHILUS";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="BASTILASHANDARK";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
        			field.value += "**Special Damage**: "+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			
        			charname="GRANDADMIRALTHRAWN";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
        			field.value += "**Special Damage**: "+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
	            	
        			
        			charname="SITHTROOPER";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="EMPERORPALPATINE";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
	            	
	            }
	            if(squadName.includes('cls')||squadName.includes('CLS')||squadName.includes('luke')||squadName.includes('LUKE')){
	            	

	            	let charname="COMMANDERLUKESKYWALKER";
	            	let displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
        			let field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
                    field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
	            	embed.fields.push( field )

	            	charname="HANSOLO";
	            	displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )

        			charname="CHEWBACCALEGENDARY";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="CHIRRUTIMWE";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")"+display_cross_check(stats[0].stats[charname].stats.final.Speed,250)+"\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
        			field.value += "**Special Damage**: "+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			
        			charname="BAZEMALBUS";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon_bold(displayed_toon[0],unitIndex,charname)
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
        			field.value += "**Special Damage**: "+stats[0].stats[charname].stats.final["Special Damage"]+" (+"+stats[0].stats[charname].stats.mods["Special Damage"]+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
	            	
        			
        			charname="R2D2_LEGENDARY";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
        			charname="OLDBENKENOBI";
        			displayed_toon = player.characters.filter(u =>u.defId.includes(charname));
	            	field = displaytoon(displayed_toon[0],unitIndex,charname,"*")
        			field.value += label_speed+stats[0].stats[charname].stats.final.Speed+" (+"+stats[0].stats[charname].stats.mods.Speed+")\n";
        			field.value += label_tenacity+(displayNumber(stats[0].stats[charname].stats.final.Tenacity,100,2))+"% (+"+(displayNumber(stats[0].stats[charname].stats.mods.Tenacity,100,2))+"%)\n";
        			field.value += label_health+stats[0].stats[charname].stats.final.Health+" (+"+stats[0].stats[charname].stats.mods.Health+")\n";
        			field.value += label_protection+stats[0].stats[charname].stats.final.Protection+" (+"+stats[0].stats[charname].stats.mods.Protection+")\n";
	            	field.value += display_line();
        			embed.fields.push( field )
        			
	            	
	            }
	            
	           
	            
            	
	            
	            
	           
	            
	            
	           
                
	            
	            
	           Report.dev( "BOT:embed.fields:", embed.fields.length )
	          

                await Bot.discord.util.reply.swapi(message, embed, {warning:warning, error:error})

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
	
	if(check_value>=check_mark){
		return " ✓";
	}
	return ":x: ["+check_mark+"]";
	
}

const displayNumber = ( value,multiplicator, precision) => {
	
	if(value){
		var x = Number(value);
		x=x*multiplicator;
		x=x.toFixed(precision);
		return x.toString();
	}else{
		return "0";
	}
	
	
}
const displaytoon_bold = ( toon,unitIndex,defId) => {
	return displaytoon(toon,unitIndex,defId,"**");
}



const checkZeta = (toon, zetaDefinition) => {
	
	let checkZeta=false;
	toon.skills.forEach(async skill => {
    	 if(skill.id === zetaDefinition){
    		 if(skill.isZeta && skill.tier > 7){
    			 checkZeta=true;
    		 }
    	 }
     })
	return checkZeta;
}
const checkToon = (toon,rarity,level,gear) => {
	let checkToon= 	((toon.rarity >=rarity) && (toon.level >= level) && (toon.gear >= gear));
	return checkToon;
}


const checkToonFull = (toon) => {
	return checkToon(toon,7,85,11);
	
}


const getToonStats = (stats) => {
	let toon = 
	{
            "Strength": stats.Strength,
            "Agility": stats.Agility,
            "Intelligence": stats.Intelligence,
            "Speed": stats.Speed,
            "Health": stats.Health,
            "PhysicalDamage": stats['Physical Damage'],
            "SpecialDamage": stats['Special Damage'],
            "SpecialCriticalChance": displayNumber(stats['SpecialCritical Chance'],100,2), 
            "Tenacity": displayNumber(stats['Tenacity'],100,2), 
            "Armor": displayNumber(stats['Armor'],100,2), 
            "Potency": displayNumber(stats['Potency'],100,2),
            "ResistancePenetration": stats['Resistance Penetration'],
            "PhysicalCriticalChance": displayNumber(stats['Physical Critical Chance'],100,2),
            "Protection": stats.Protection,
            "ArmorPenetration": stats['Armor Penetration'],
            "Resistance": displayNumber(stats['Resistance'],100,2),
            "CriticalDamage": displayNumber(stats['Critical Damage'],100,2)
        }
	
	return toon;
	
}
const getUnitName= (unitIndex,defId) => {
	return unitIndex.find(ui => ui.defId === defId).name;
	
}


const displaytoon = ( toon,unitIndex,defId,bold ) => {
	let unitname = unitIndex.find(ui => ui.defId === defId).name;
	
	let field = {
            name: bold+ unitname+bold,
            value: "\n",
            inline:true
        }

     field.value +="	           "
    return field;
}


module.exports = {
    help:help,
    command:command
}
