const Discord = require('discord.js')// imports the discord js library
function AutoTicketMessage(channel)
{
    if(channel.name.includes("ticket"))
    {
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Channel Name: ${channel.name}`)
        .setURL('https://discord.com/invite/Yu5wpJdfmF')
        .setAuthor('Mod Support', 'https://cdn.discordapp.com/avatars/404717378715385856/bdc9f3e337901871560a65e7aefea280.webp?size=80')
        //.setDescription('Some description here')
        .setThumbnail('https://compsci.live/logo.png')
        .addFields(
        { name: 'Please be aware that the mods have other commitments', value: 'It may take several hours or longer to answer your ticket, especially on nights and weekends.' },
        { name: '\u200B', value: '\u200B' },
        { name: 'While you are waiting for a response', value: 'You can help us by describing your problem in detail. If it relates to homework, please include the assignment requirements.'},
        { name: '\u200B', value: '\u200B' },
        { name: 'If this is a ticket for help with an assignment', value: 'Please ensure you have read and understood the `how to ask for help` document, located here: https://docs.google.com/document/d/1de_N24_ewXeIRyC5eAMELzoY1qMw7oREJd2qPduTEd4/edit'},
        { name: '\u200B', value: '\u200B' },
        )
        .setTimestamp()
        .setFooter('Please note, this ticket will automatically close in 24 hours!  Thanks!');

        channel.send(exampleEmbed);
    }
}

module.exports = { AutoTicketMessage }