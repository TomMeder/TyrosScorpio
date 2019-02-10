if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
	mongoAdminPassword = process.env[mongoServiceName + '_ADMIN_PASSWORD'];
    mongoUser = process.env[mongoServiceName + '_USER'];
	
	
	console.log('Connected to MongoDB at: %s', mongoDatabase);
}


module.exports = {
	
    //SWAPI config
	"swapi":{
      	"mongo":{
	        "user":mongoUser,
	        "pass":mongoPassword,
	        "host":mongoHost,
	        "port":mongoPort,
	        "auth":"?authSource="+mongoDatabase,
	        "db":mongoDatabase
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
	    "token":"NTIxMDg3MzY5NzY0NjY3NDAy.Du3VPA.e9PjtY46mnqAENsqFKcErmeuJ_I",
	    "prefix":"!",
        "master":[ "299274718291427338" ],	
	    "blacklist":"/config/data/blacklist.json",
	    "premium":"/config/data/premium.json",
	    "commands":{
	        "help_commands":{
	            "help":"This help menu",
	            "invite": "Invite this bot",
                "swgoh": "SWGoH bots and tools",
                "discord": "SWGoH related discords",
                "support": "Support me on patreon",
	        },
	        "utilities":{
	            "raw":"Data for your tools",
	            "add":"Register your allycode",
	            "rem":"Unregister your allycode",
	            "whois":"Lookup by mention or allycode",
                "translate": "Google translate"
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
	            "dsgo":"DSGO recommendations",
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
            },
            "premium_commands":{
                "vsu":"G-vs-G Units of interest",
                "vss":"G-vs-G Squads of interest"
            },
	        "hidden":{
	            "status":true,
	            "premium":true,
	            "blacklist":true,
	        }
	    }
	}
}
