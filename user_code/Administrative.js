//Administrative.js
const { brendanid, modrole }= require('../ids.json');

//Function called with prefix !ban, used to attempt user ban
async function ban(message) 
{
    // Assuming we mention someone in the message, this will return the user
        // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
        var server = message.guild.id;
        
        if(((message.author.id !== `${brendanid}`) && server === '707293853958275125') || (((message.author.id !== '622181883396096002') || (message.author.id !== '344506661601280000')) && server === '731575925262778450'))
        {
          message.reply('I was unable to ban the member!  Permission denied!');
          return;
        }
  
        const user = message.mentions.users.first();
        // If we have a user mentioned
        if (user) {
          // Now we get the member from the user
          const member = message.guild.member(user);
          // If the member is in the guild
          if (member) {
            /**
             * Ban the member
             * Make sure you run this on a member, not a user!
             * There are big differences between a user and a member
             * Read more about what ban options there are over at
             * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
             */
            member
              .ban({
                reason: 'They were bad!',
              })
              .then(() => {
                // We let the message author know we were able to ban the person
                message.reply(`Successfully banned ${user.tag}`);
              })
              .catch(err => {
                // An error happened
                // This is generally due to the bot not being able to ban the member,
                // either due to missing permissions or role hierarchy
                message.reply('I was unable to ban the member');
                // Log the error
                console.error(err);
              });
          } else {
            // The mentioned user isn't in this guild
            message.reply("That user isn't in this guild!");
          }
        } else {
          // Otherwise, if no user was mentioned
          message.reply("You didn't mention the user to ban!");
        }
}

//function called on prefix !kick, used to kick a specific member
async function kick(message) 
{
  var server = message.guild.id;

  //if((message.author.id !== `${brendanid}`) || (message.author.id === '622181883396096002') || (message.author.id === '344506661601280000') || (message.author.id === '102578756194955264') || (message.author.id === '180820200776531968'))
  if(((message.author.id !== `${brendanid}`) && server === '707293853958275125') || ((message.author.id !== '622181883396096002') || (message.author.id !== '344506661601280000') && server === '731575925262778450'))
  {
      message.reply('I was unable to kick the member!  Permission denied!');
      return;
    }
    
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
        // Now we get the member from the user
        const member = message.guild.member(user);
        // If the member is in the guild
        if (member) {
        /**
         * Kick the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
        member
            .kick('Optional reason that will display in the audit logs')
            .then(() => {
            // We let the message author know we were able to kick the person
            message.reply(`Successfully kicked ${user.tag}`);
            })
            .catch(err => {
            // An error happened
            // This is generally due to the bot not being able to kick the member,
            // either due to missing permissions or role hierarchy
            message.reply('I was unable to kick the member');
            // Log the error
            console.error(err);
            });
        } else {
        // The mentioned user isn't in this guild
        message.reply("That user isn't in this guild!");
        }
        // Otherwise, if no user was mentioned
    } else {
        message.reply("You didn't mention the user to kick!");
    }
}

//Lists bot commands as a help message
async function help(message) 
{
    message.channel.send('Available Commands!\n' +
                  '[ALL]!help : Displays this help command with a list of bot commands!\n' +
                  '[ALL] !focusmode duration time(hour(s)/minutes(s)/seconds(s)) : Locks you out of every channel for a certain amount of time!\n' +
                  '[ALL] !ping : Displays the bots ping!\n' +
                  '[ALL] !quote : Generate a random cs-quote(MOST OF THESE ARE FUNNY ASF)\n' +
                  
                  '[CompSci ONLY] !ratep : name description : Rate a professor!\n' +
                  '[CompSci ONLY] !viewratings name : Get the rating of a teacher!\n' +
                  '[CompSci ONLY] !motivateme : Sends a motivational quote or meme\n' +
                  `[CompSci ONLY] $open : Open a ticket to get help from a mod\n` +
                  `[CompSci ONLY] $close : Close a ticket\n` +
                  '[CompSci ONLY] !makemelaugh : Generates a random asf quote\n');
}

//Code for wiping a specified number of messages from a channel (MOD ONLY)
async function clean(message, num, client)
{
  if(message.member.roles.cache.find(r => r.name === `${modrole}`)) 
  { 
    if(num>100 || num<2)
    {
      message.channel.send("Unable to delete!  Args must be between 2 and 100!");
      return;
    }
    message.channel.bulkDelete(`${num}`).then(() => {
      message.channel.send(`MASS DELETED ${num} MESSAGES!`).then(msg => {
        msg.delete({timeout: 3000});
      })
    });

    let server = message.guild.id;
    if(server === `707293853958275125`) 
    {   //CompSci Server ID
      client.channels.cache.get("784093143389700137").send(`${message.author.username} deleted ${num} messages in ${message.channel}`);
    }
    else if(server === `731575925262778450`) 
    {   //EMU Hangout Server ID
      client.channels.cache.get("769636044064030741").send(`${message.author.username} deleted ${num} messages in ${message.channel}`);
    }
  }
  else 
  {
    message.channel.send(`Access Denied!`).then(msg => {
      msg.delete({timeout: 3000});
    });
    message.delete({ timeout: 2000 });
    return;
  }
}

async function mno(message) {
  var time = new Date();
  if (message.member.hasPermission('MOD')) {
    let role = message.guild.roles.cache.find(role => role.name === `${ModsNightOff}`);
    message.member.roles.add(role).catch(console.error);
    message.channel.send('Looks like ' + message.author.username + ' is taking the night off!')
    if (time.getHours() == 0)
      message.member.roles.remove(role).catch(console.error);
  }
}


async function lockChannel(message) 
{
  var parameter = message.content.slice(10).trim();
  var timeString = parameter.substr(0,parameter.indexOf(' '));
  var time = parseInt(timeString) * 3600000;
  if (message.member.hasPermission('ADMINISTRATOR')) {
    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
    if (timeString > 1) message.channel.send('Lockdown set for ' + timeString + ' hours. Good luck on your exam!');
    else message.channel.send('Lockdown set for ' + timeString + ' hour. Good luck on your exam!');
    setTimeout(() => {
      message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
      message.channel.send('Lockdown lifted')
  }, time); 
  }
}

module.exports = { kick, ban, help, clean, mno, lockChannel }