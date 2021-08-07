const { prefix } = require('../config.json')
const fs = require('fs');
const csv = require('csv-parser');
const readline = require('readline');
const { SSL_OP_TLS_BLOCK_PADDING_BUG } = require('constants');
const semester = ('Summer 2021')//change to new semester
function csvparse(message,table)
{   
    // If CSV is parsing undefined, make sure first line is the fields for CSV,
    // not ---ComputerScience---, or it wont run
    // also ONLY do CS class list not all of EMU (or is will get messy really quick)
    var rolename
    fs.createReadStream('Summer 2021 Class Schedule.csv')
    .pipe(csv())
    .on('data', (row) => { 
    
    var Subj =  `${row["Subj"]}`;
    var Crse =  `${row["Crse"]}`;
    var time =  `${row["Time"]}`;
    var name =  `${row["Instructor"]}`;
    var instructorarray = name.replace("(P)", "").trim().split(" ");
    var lastnamepos = (instructorarray.length -1);
    var channelname = `${Subj}-${Crse}-${instructorarray[lastnamepos]}`;
    rolename =  `${Subj} ${Crse}`;
    createchannel(channelname,message,table)
    })
    .on('end', () => {
    console.log('CSV file successfully processed');
        
    });
}
function driver(message){
    var promise=new Promise(function(){
      categorycreator(message);
    }).then((table)=>{
        console.log(`test: ${Object.entries(table)}`)
        //why is this not printing 
        csvparse(message,table);
        
    }).catch(console.error)
}
//create categories first, then as channels are created match them
function categorymatcher(message,rolename){
    message.guild.channels.cache.forEach(channel => { 
        console.log(`${channel.name}`)
        if(channel.type==='category'&& `${channel.name}`.includes(`${rolename}`)){
            console.log(`matched ${channel.name} and ${rolename}`)
        }
    });
}
//   creates basic CompSci Class Categories
//   Not for individual category creation
//   change semester name (hardcoded)
function categorycreator(message)
{   
    var catTable=new Object();
    const readInterface = readline.createInterface(
    {
        input: fs.createReadStream('./categories.txt'),
        output: process.stdout,
        console: false
    });

    readInterface.on('line', function(line) 
    {
        var channel = message.guild.channels.create(`${line} ${semester}`, { type: 'category' })
        .then(channel => {
            catTable[`${line}`]=channel.id
        }).catch(console.error)
    }).on('close',function(catTable){
        return catTable;
    })
}


function createchannel(name, message, table)
{
    message.guild.channels.create(name, { reason: 'Needed a cool new channel' })
        .then(channel => {
            console.log(channel.name)
            if(table!=null){  
              //for (var i; i = 0; i++){
               console.log(Object.keys(table)[i]);
              //}
            }else{
                console.log("table is null")
            } }).catch(console.error);
}

async function deletechannel(message)
{
    message.guild.channels.cache.forEach(channel => {
        //ignores:references, github, devwork, classic-quotes,bot-status, voice, devtalk, content approval, and general

        if((channel.id!==('823034099925123092') && channel.id!==('823034119167672340') && channel.id!==('823034112155189268') && channel.id!==('823034145868349470')&& channel.id!==('838150077834854411')&& channel.id!==('838149486353842198')&& channel.id!==('838195992624103475')&& channel.id!==('841873032011055114')&& channel.id!==('841424759128588369')&& channel.id!==('823034099925123092'))){
        channel.delete()}});
}

function deletecategory(message)
{
    message.guild.channels.cache.forEach(category => {
        if(category.id !== ('823029672630943757'))
        {
        category.delete()}});
}

async function swapper(name, message)
{
    let category = message.guild.channels.cache.find(c => c.name == "Text Channels" && c.type == "category"),
    channel = message.guild.channels.cache.find(c => c.name == `${name}` && c.type == "text");
  
  if (category && channel) channel.setParent(category.id);
  else console.error(`One of the channels is missing:\nCategory: ${!!category}\nChannel: ${!!channel}`);
}


async function channelsort(message)
{
    var textchannels = {} = message.guild.channels.cache.forEach(c => c.type == "text")
}

//delete unused ones at somepoint
module.exports = { csvparse, createchannel, deletechannel, categorycreator,driver,categorymatcher, deletecategory, swapper, channelsort};
