/*
    made by yeonfish#2474
    korean bots hackaton project

    discord.js library version 13.2.0
*/
console.log("program started -----------------------------------")
//require discord.js library
const Discord = require("discord.js");
const {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageAttachment,
    Permissions,
    Intents,
    Util,
    MessageSelectMenu
} = require('discord.js');
//declare discord client
const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES]
});
//require REST
const {
    REST
} = require('@discordjs/rest');
//require discord-api
const {
    Routes
} = require('discord-api-types/v9');
//util
const wait = require('util').promisify(setTimeout);
//require node js filesystem
const fs = require('fs');
//require node js evt tools
const events = require('events');
//make EventEmitter
const evt = new events.EventEmitter();
//get discord bot configures
const config = require("./config.json");
//require date utils. use to get date
require('date-utils');

//slash command part start ####################

//get commands
const commands = [];
const devs = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const devFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.dev'));

//make to array
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}
for (const file of devFiles) {
    const dev = require(`./commands/${file}`);
    devs.push(dev.data.toJSON());
}
//set rest
const rest = new REST({
    version: '9'
}).setToken(config.BOT_TOKEN);
//refresh commands
(async () => {
    try {
        // notice command refreshing
        console.info('INFO : Started refreshing application (/) commands.');
        console.log("=========================================================================");
        // register commands
        await rest.put(
            Routes.applicationGuildCommands("923940375985520700", "911676954317582368"),
            //Routes.applicationCommands("923940375985520700"), 
            {
                body: commands
            }
        );
        // listing bot commands
        var list = new Array();
        var devList = new Array();
        commands.forEach(element => {
            list.push(element.name);
        });
        for (let index = 0; index < commandFiles.length; index++) {
            console.info("INFO : [" + commandFiles[index] + "] command - " + list[index] + " loaded");
        }
        devs.forEach(element => {
            devList.push(element.name);
        });
        var divid = true
        for (let index = 0; index < devFiles.length; index++) {
            if (divid) {
                divid = false;
                console.log("=========================================================================");
            }
            console.info("INFO : [" + devFiles[index] + "] command - " + devList[index] + " is developing... It'll not loaded");
        }
        // notice command refreshing complete
        console.log("=========================================================================");
        console.info('INFO : Successfully reloaded application (/) commands.');
    } catch (error) {
        // loging error
        console.error(error);
    }
})();
//slash command end ##########################
client.on("ready", () => {
    var time = new Date();
    console.log(`login as ${client.user.tag} - ${time}`);
    client.user.setActivity('/도움말 듣는중', {
        type: 'LISTENING'
    });
})
client.on("interactionCreate", async (interaction) => {

})
client.on("messageCreate", async (message) => {
    if (message.author.id == "766514069036859392") {
        const commandBody = message.content.replace("!?!", "");
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();
        if (command == "eval") {
            try {
                var result = await eval("("+message.content.replace("!?!"+command+" ", "")+")")
                if (result == "") {
                    result = "null"
                }
                message.channel.send(result)
            } catch (e) {
                message.reply("```error detected```");
                await wait(1000);
                message.channel.send("```"+e+"```");
            }
        }
    }
})
client.login(config.BOT_TOKEN)