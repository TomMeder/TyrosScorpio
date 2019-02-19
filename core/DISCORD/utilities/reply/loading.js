module.exports = async ( message, options, MESSAGE ) => {
    const embed = Object.assign({
        title: "Loading",
        description: "please wait...\n",
        color: 0xAAAAAA,
        footer: { text: "Searching..." },
        image: { url:"https://cdn.discordapp.com/attachments/529308301616349194/547181516099289128/4jeBvb8.gif" },
        timestamp: new Date()
    }, options || {})
    
    try {
        return MESSAGE ? MESSAGE.edit({embed}) : await message.channel.send({embed})
    } catch(e) {
        console.error("ERROR: Loading",e.message)
        return await message.author.send({embed})
    }
}
