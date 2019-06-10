module.exports = {
	
    //SWAPI config
	"swapi":{
      	"mongo":{
	        "user":"tom_user",
	        "pass":"bYIFhr0xQctyRSaxnZ9p",
	        "host":"192.168.1.35",
	        "port":32775,
	        "auth":"?authSource=admin",
	        "db":"swapi"
      	},
      	"api":{
	        "username":"TyroVest",
	        "password":"TVSWgoh1977",
        	"language":"eng_us"
      	}
    },

	//DISCORD config
	"discord":{
        "debug":true,
	    "token":"NTQ0MjM1NzU0NTk1OTQyNDAx.D0IKtQ.Qon87d22-DK0wy2t85fcUmIj7yU",
	    "prefix":"-",
        "master":[ "299274718291427338" ],	
	    "blacklist":"/config/data/blacklist.json",
	    "whitelist":"/config/data/whitelist.json",
	    "premium":"/config/data/premium.json",
	    "commands":{
	        "help_commands":{
	            "help":"This help menu",
	            "invite": "Invite this bot"
	        },
	        "utilities":{
	            "add":"Register your allycode",
	            "rem":"Unregister your allycode",
	            "whois":"Lookup by mention or allycode"
            },
	        "player_commands":{
	            "p":"Player details",
	            "pz":"Player zetas",
	            "ps":"Player-ship details",
	            "pc":"Player-character details",
	            "pca":"Player-character arena",
	            "psa":"Player-ship arena",
	            "z":"Zeta recommendations",
	            "t":"Toms recommendations",
	            "ti":"Team Instinct recommendations",
	            "counter":"Counter Teams",
	            "scm":"Check Ship Crew Mods"
	            
	        },
	        "guild_commands":{
	            "g":"Guild details",
	            "gz":"Guild zetas",
	            "gs":"Guild-ship details",
	            "gc":"Guild-character details",
	            "ggp":"Guild details by GP",
	            "gvs":"Guild-vs-guild summary",
	            "gvu":"Guild-vs-guild units of interest",
	            "tb":"List guild members by unit",
	            "dsgozeta":"DSGO recommendations for zetas",
	            "speedmods":"Anzahl der +20 Speedmods",
            },
            "premium_commands":{
                "vsu":"G-vs-G Units of interest",
                "vss":"G-vs-G Squads of interest"
            },
	        "hidden":{
	            "status":false,
	            "premium":false,
	            "blacklist":false,
	        }
	    }
	}
}
