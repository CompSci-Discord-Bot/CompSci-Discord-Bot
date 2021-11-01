
//Used only to compare the server IDs over a predefined server... And to
//compare it to where the message originated

module.exports = (message, servercode, callback) => {

    const server = message.guild.id;
      
      if(server === (`${servercode}`))
      {
        callback(message)
      }
}