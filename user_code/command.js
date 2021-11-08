const { prefix } = require('../config.json')

module.exports = (message, aliases, callback) => {
  if (typeof aliases === 'string') 
  {
    aliases = [aliases]
  }
    const { content } = message;
      
    aliases.forEach((alias) => 
    {
      const command = `${prefix}${alias}`
      if(content.startsWith(`${command} `) || content === command)
      {
        console.log(`Running the command ${command}`);
        callback(message)
      }
    })
}