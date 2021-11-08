//Function that shuts down bot on kill command by specific user!
const { brendanid, modrole, generalchat }= require('../ids.json');
const { prefix } = require('../config.json')
const cron = require('cron');

function cronjobs(client)
{
  //Sends a professor quote in General at 9 AM
    var date = new Date();
    console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
    
      let cronjob = new cron.CronJob('00 00 14 * * 1-5', () => {
        //CRON JOBS ARE IN UTC TIME!  EST TIME + 4 or 5 HOURS
        //DO NOT CHANGE ANYTHING IN THIS FUNCTION UNLESS YOU KNOW WHAT YOU ARE DOING! 
        client.channels.cache.get(`${generalchat}`).send(`${prefix}quote`); 
        console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
      });

      //A cronjob to say Happy Birthday every hour on the hour whenever the cronjob is run
      let cronjob2 = new cron.CronJob('0 0 * 5 5 *', () => {
        //CRON JOBS ARE IN UTC TIME!  EST TIME + 4 or 5 HOURS
        //DO NOT CHANGE ANYTHING IN THIS FUNCTION UNLESS YOU KNOW WHAT YOU ARE DOING! 
        var time = new Date();
        var hour = time.getHours();
        console.log(`Cronjob4 executing at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)

        var values = [
          "Happy Birthday!",
          "Happy Getting Older Day!",
          "Joy to you on the anniversary of your coming into this world!",
          "Happy anni-birth-sary!",
          "A toast to you on your birthday, and many more to come!",
          "Happ Birth!",
          "HBD!",
          "Alles Gute zum Geburtstag!",
          "Happy Cake Day!",
          "Congratulations, you’re another year closer to death!",
          "Happy Birthday! No, I didn't need Facebook to know that!",
          "It's your birthday, get drunk.",
          "Merry Christmas! Wait, no that's not right...",
          "Happy 22nd revolution around the sun!",
          "Happy 1 year closer to getting a senior citizen discount!",
          "Happy eviction from your mother's belly day!",
          "Level up! 21-->22",
          "I commend you and your ability to evade death!",
          "If you were Jesus, today would be Christmas.",
          "Happy Womb Independence Day!",
          "Your birthday is one of the two days in your life that do not span 24 hours, the other being your death. Happy Birthday!",
          "\"Happy Birthday!\" -Frosty The Snowman",
          "Exactly one year from now, you will not be as old as you are today. Woah.",
          "!yadhtirB yppaH"
      ];

        var bdaymessage = values[hour];
        client.channels.cache.get(`826556735707676682`).send(`${bdaymessage}`); 
      });

    cronjob.start()
}

//The off switch for this entire ensemble
async function kill(message) 
{
    if (message.author.id !== `${brendanid}`) return;
    message.channel.send('Stopping the bot as per exclusive admin command!').then(() => 
    {
        process.exit(1);
    })
}

//Function that makes bot unresponsive to commands until repeat of softkill command!
function soft_kill(message, softkill) 
{
  if(message.member.roles.cache.find(r => r.name === `${modrole}`)) 
  {
    message.channel.send('SoftKill '+!softkill)
    return !softkill;
  }
}

//Adds function to bypass filter with a bypass toggle command!
function bypass(message, bypass) 
{
  if(message.member.roles.cache.find(r => r.name === `${modrole}`)) 
  {    
    message.channel.send('Caps Bypass: '+!bypass)
    return !bypass;
  }
}

module.exports = { kill, soft_kill, bypass, cronjobs };