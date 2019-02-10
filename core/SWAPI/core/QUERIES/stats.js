module.exports = async ( message ) => {

    try {

        const today = new Date()
        //const acIn = Object.assign([], message.allycode)
        
        //console.log("SWAPI: Stats: Querying players:", acIn.length)

        //One hour cooldown on players
//        const unexpired = today.getTime() - (1*60*60000)

//        console.log("SWAPI: Unexpired is gt:", (new Date(unexpired)).toLocaleString())
        
      

 
        if( message.allycode ) {

            console.log("SWAPI: Stats: Fetching player:", message.allycode)
            console.log("SWAPI: Stats: Fetching player:", message.allycode)
              
            let response = {}

            
            
            try { 
                SWAPI.apiq++
                let flags = ['withModCalc','gameStyle'];
                response = await SWAPI.api.client.calcStats(message.allycode,'',flags,1)
                
                //console.log("SWAPI: Stats: Result:"+JSON.stringify(response, null, 4))
                SWAPI.apiq--
            } catch(e) {
                SWAPI.apiq--
                console.log("SWAPI: Stats: error:", e)
                //response.error = e
            }

            if( response.result ) {
            	console.log("SWAPI: Stats: Result is here:")
                process.send(JSON.stringify({
                    id:message.id,
                    data:{
                        result:response.result,
                        error:null,
                        warning:null
                    }
                }))
                
            }
            
/*            if( response.warning ) { 
                console.log("SWAPI: Fetched with warning:", response.warning)
                process.send(JSON.stringify({
                    id:message.id,
                    data:{
                        result:null,
                        error:null,
                        warning:response.warning
                    }
                }))
            }
            
            if( response.error ) { 
                response.error.message = response.error.type === 'invalid-json' 
                    ? 'API Error'
                    : response.error.message
                response.error.error = response.error.message
                response.error.description = 'Sorry, I am currently disconnected from API...please try again later'
                    
                console.log("SWAPI: Fetched with error:", response.error)
                process.send(JSON.stringify({
                    id:message.id,
                    data:{
                        result:null,
                        error:response.error,
                        warning:null
                    }
                }))
            }
*/
            console.log("SWAPI: Fetched complete")
        }

        process.send(JSON.stringify({id:message.id}))

    } catch(e) {
SWAPI.report.error(e)

        process.send(JSON.stringify({
            id:message.id,
            data:{
                result:null,
                error:e,
                warning:null
            }
        }))
        process.send(JSON.stringify({id:message.id}))
    }
}
