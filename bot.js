//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});


const env = process.env.NODE_ENV || 'development'
const config = require("./config/config.js")


//Global bot reference
global.Bot = {
    root    : process.cwd(),
    env     : env,
    app     : require("./package.json"),
    config  : config[env],
    
    //Load event handlers
    open  : require('./config/open.js'),
    close : require('./config/close.js')
}

global.OUTPUT = require('./localization')

//Global logging
global.Report = {
    log   : console.log,
	info   : console.log,
	dev   : console.log,
	error   : console.error
    //info  : env === 'production' ? console.log : () => {},
    //dev   : env !== 'production' ? console.log : () => {},
    //error : env !== 'production' ? console.error : () => {},
	
	
}


if( !config ) {
    Report.error( `Unable to load config "${env}"` )
    process.exit(0)
}


process.on('SIGTERM', Bot.close)
process.on('SIGINT',  Bot.close)


//Do bot start up
Bot.open();

