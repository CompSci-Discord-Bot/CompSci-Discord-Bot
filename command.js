const { prefix } = require('./config.json')

module.exports = (client, aliases, callback) => {
  if (typeof aliases === 'string') 
  {
    aliases = [aliases]
  }

client.on('message', message => 
  {
    if(!message.content.startsWith(`${prefix}quote`))
    {
      if(message.author.bot) 
        return;
    }

      const { content } = message;
      
      aliases.forEach((alias) => {
        const command = `${prefix}${alias}`

        if(content.startsWith(`${command} `) || content === command)
        {
          console.log(`Running the command ${command}`);
          callback(message)
        }
      })
  })
}