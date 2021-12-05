
//Used only to compare the server IDs over a predefined server... And to
//compare it to where the message originated

module.exports = (message, servercode, devstate, callback) => {

    const server = message.guild.id;
      
      if((server === (`${servercode}`)) || (`${devstate}`) == 'true')
      {
        callback(message)
      }
}