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
//get discord bot configures
const config = require("./config.json");
//db
const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: config.DB.USERNAME,
    password: config.DB.PASSWORD,
    database: "discord"
});
con.connect(async function (err) {
    if (err) throw err;
    await wait(1000)
    console.info("DB conected!");
});
//require things need to calendar
const readline = require('readline');
const {
    google
} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = "./token.json"
//make EventEmitter
const evt = new events.EventEmitter();
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
}).setToken(config.BOT.TOKEN);
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
    client.user.setActivity('/????????? ?????????', {
        type: 'LISTENING'
    });
})
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const command = interaction.commandName;
        const option = interaction.options;
        if (command === "???") {
            const botPing = new MessageEmbed()
                .setTitle("Pong!")
                .setDescription("~~Sorry for my dad joke~~")
                .setTimestamp()
                .setFooter("yeonfish#2474", "https://cdn.discordapp.com/avatars/766514069036859392/e9488124498a5048cf6ecc1bd5ef07f2.webp")
                .addField("???????????? ??????", Date.now() - interaction.createdTimestamp + "ms")
                .addField("???????????? api ?????? : ", client.ws.ping + "ms")
                .setColor("RANDOM")
            interaction.reply({
                embeds: [botPing]
            })

        }
        if (command === "?????????") {
            const selectList = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                    .setCustomId('help_list')
                    .setPlaceholder('??????????????????!')
                    .addOptions([{
                            label: '??????-?????????',
                            description: '??????????????? ??????, ???????????? ????????? ???????????? ???????????? ???????????? ???????????? ???????????????',
                            value: 'help-notice',
                        },
                        {
                            label: '?????????-?????????',
                            description: '???????????? ?????? ???????????? ?????????????????? ???????????? ???????????????',
                            value: 'help-post',
                        },
                        {
                            label: '??????-?????????',
                            description: '????????? ???????????? ???????????? ?????? ???????????? ???????????? ???????????????',
                            value: 'help-vote',
                        },
                        {
                            label: '??????-?????????',
                            description: '????????? ???????????? ???????????? ?????? ???????????? ???????????? ???????????????',
                            value: 'help-calendar',
                        },
                    ]),
                );
            interaction.reply({
                content: '????????? ?????????????????? ??????????????????! - ',
                components: [selectList]
            })
            interaction.channel.send("```?????? ??????????????? ?????? ????????????? ?????? ????????????!```\nhttps://github.com/yeonfish6040/k-t-d")
            evt.on("HELP_TIME_OVER", () => {
                interaction.editReply({
                    content: "??????????????? ?????????????????????",
                    components: []
                });
            })
            var byUser = false;
            const collector = await interaction.channel.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                time: 20000
            });
            collector.on('collect', async i => {
                if (i.isSelectMenu()) {
                    if (i.user.id != interaction.user.id || i.channel.id != interaction.channel.id || i.customId != "help_list") return
                    var id = i.customId;
                    var value = i.values;
                    byUser = true;
                    collector.stop();
                    const noticeHelp = new MessageEmbed()
                        .setTitle("????????? - ??????")
                        .setDescription("??????????????? ??????, ???????????? ????????? ???????????????")
                        .setTimestamp()
                        .setFooter("yeonfish#2474", "https://cdn.discordapp.com/avatars/766514069036859392/e9488124498a5048cf6ecc1bd5ef07f2.webp")
                        .addField("/?????? ??????", "????????? ???????????????. ?????? ????????? ???????????????.")
                        .addField("/?????? ??????", "?????? ?????? ?????? ????????? ???????????????. ?????? ????????? ??????????????????")

                    const postHelp = new MessageEmbed()
                        .setTitle("????????? - ?????????")
                        .setDescription("???????????? ??????????????? ??????, ????????? ?????????")
                        .setTimestamp()
                        .setFooter("yeonfish#2474", "https://cdn.discordapp.com/avatars/766514069036859392/e9488124498a5048cf6ecc1bd5ef07f2.webp")
                        .addField("/????????? <????????? ??????> -> ????????? ??????", "???????????? ???????????????. ?????? ????????? ???????????????. (???????????? ?????? ??????)")
                        .addField("/????????? <????????? ??????> -> ????????? ??????", "?????? ?????? ?????? ???????????? ???????????????. ?????? ????????? ??????????????????")

                    const calenderHelp = new MessageEmbed()
                        .setTitle("????????? - ??????")
                        .setDescription("???????????? ????????? ???????????????")
                        .setTimestamp()
                        .setFooter("yeonfish#2474", "https://cdn.discordapp.com/avatars/766514069036859392/e9488124498a5048cf6ecc1bd5ef07f2.webp")
                        .addField("??????", "????????? ????????? ??????????????? ???????????????. ???, ?????? ???????????? ???????????????.")

                    const voteHelp = new MessageEmbed()
                        .setTitle("????????? - ??????")
                        .setDescription("???????????? ????????? ??????????????? ????????????, ??????????????? (???????????? ???????????????)")
                        .setTimestamp()
                        .setFooter("yeonfish#2474", "https://cdn.discordapp.com/avatars/766514069036859392/e9488124498a5048cf6ecc1bd5ef07f2.webp")
                        .addField("??????", "????????? ????????? ??????????????? ???????????????. ?????????,  ???????????? ???????????? ???????????? ???????????????.")

                    const closeButton = new MessageActionRow()
                        .addComponents(
                            btn = new MessageButton()
                            .setCustomId('close')
                            .setLabel('??????')
                            .setStyle('DANGER')
                        );
                    switch (value[0]) {
                        case "help-notice":
                            i.update({
                                content: "?????? ??????????????????",
                                embeds: [noticeHelp],
                                components: [closeButton]
                            });
                            break;

                        case "help-post":
                            i.update({
                                content: "????????? ??????????????????",
                                embeds: [postHelp],
                                components: [closeButton]
                            });
                            break;
                        case "help-vote":
                            i.update({
                                content: "?????? ??????????????????",
                                embeds: [voteHelp],
                                components: [closeButton]
                            });
                            break;
                        case "help-calendar":
                            i.update({
                                content: "?????? ??????????????????",
                                embeds: [calenderHelp],
                                components: [closeButton]
                            });
                            break;
                    }
                    var closed = false;
                    const closeHelpCollector = await interaction.channel.createMessageComponentCollector({
                        componentType: 'BUTTON',
                        time: 500000
                    });
                    closeHelpCollector.on('collect', async (interact) => {
                        if (interact.user.id != interaction.user.id || interact.channel != interaction.channel || interact.customId != "close") return
                        closed = true;
                        closeHelpCollector.stop();
                        interact.reply({
                            content: "????????????",
                            ephemeral: true
                        });
                        interact.deleteReply()
                    })
                    closeHelpCollector.on("end", () => {
                        if (closed) return
                        interact.deleteReply()
                    })
                }
            });
            collector.on('end', collected => {
                if (byUser) return
                evt.emit("HELP_TIME_OVER")
            });
        }
        if (command === "?????????") {
            const postMenu = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                    .setCustomId('post_menu')
                    .setPlaceholder('??????????????????!')
                    .addOptions([{
                            label: '????????? ??????',
                            description: '???????????? ?????????',
                            value: 'write-post',
                        },
                        {
                            label: '????????? ??????',
                            description: '???????????? ?????? ???????????? ?????????????????? ???????????? ???????????????',
                            value: 'view-post',
                        }
                    ]),
                );
            interaction.reply({
                content: '????????? ?????????????????? ??????????????????!',
                components: [postMenu]
            })
            evt.on("POST_MENU_TIME_OVER", () => {
                interaction.editReply({
                    content: "??????????????? ?????????????????????",
                    components: []
                });
            })
            const collector = await interaction.channel.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                time: 20000
            });
            collector.on('collect', async interact => {
                if (interact.isSelectMenu()) {
                    evt.on("ALL_STOP", () => {
                        collector.stop()
                    })
                    if (interact.user.id != interaction.user.id || interact.channel.id != interaction.channel.id || interact.customId != "post_menu") return
                    var id = interact.customId;
                    var value = interact.values;
                    byUser = true;
                    collector.stop();
                    const closeButton = new MessageActionRow()
                        .addComponents(
                            btn = new MessageButton()
                            .setCustomId('close')
                            .setLabel('??????')
                            .setStyle('DANGER')
                        );
                    switch (value[0]) {
                        case "write-post":
                            interaction.editReply({
                                content: "????????? ??????????????????",
                                components: [],
                                ephemeral: true
                            })
                            const filter = m => m.author.id == interaction.user.id && m.channel.id == interaction.channel.id
                            const postContentCollector = await interaction.channel.createMessageCollector({
                                filter,
                                time: 500000
                            });
                            postContentCollector.on("collect", async (m) => {
                                evt.on("ALL_STOP", () => {
                                    postContentCollector.stop()
                                })
                                m.delete()
                                con.query(`INSERT INTO \`malang_post\` (\`guildId\`, \`userId\`, \`subject\`, \`text\`) VALUES (${interaction.guild.id}, ${interaction.user.id},' ${option.getString("??????")}', '${m.content}')`, function (err, result) {
                                    if (err) throw err;
                                    con.query(`SELECT * FROM \`malang_post\` WHERE \`guildId\` LIKE ${interaction.guild.id} AND \`subject\` LIKE '${option.getString("??????")}'`, async function (err, result) {
                                        if (result.length == 0) {
                                            interaction.editReply({
                                                content: "????????? ?????????????????????",
                                                components: [],
                                                ephemeral: true
                                            })
                                            postContentCollector.stop();
                                        } else {
                                            interaction.editReply({
                                                content: "?????? ???????????? ?????? ???????????????",
                                                components: [],
                                                ephemeral: true
                                            })
                                            postContentCollector.stop();
                                        }
                                    });

                                });
                            })
                            break;

                        case "view-post":
                            con.query(`SELECT * FROM \`malang_post\` WHERE \`guildId\` LIKE ${interaction.guild.id} AND \`subject\` LIKE '%${option.getString("??????")}%'`, async function (err, result) {
                                if (err) throw err;
                                if (result.length == 0) {
                                    const postList = new MessageEmbed()
                                        .setTitle("????????? ?????? ??????")
                                        .setDescription("?????? ????????? ???????????? ??????????????????")
                                        .setTimestamp()
                                        .setFooter("0?????? ?????? ?????????", "https://t1.daumcdn.net/cfile/tistory/247248355950753B3C")
                                        .addField("??????", "??????????????? ????????????")
                                        .setColor("RANDOM")
                                    interaction.editReply({
                                        content: "????????????",
                                        embeds: [postList],
                                        components: []
                                    })
                                } else {
                                    text = ``;
                                    int = 1;
                                    results = result.slice(0, 10);
                                    subjects = new Array();
                                    evt.on("nextPostList", (evtRIntercation) => {
                                        subjects = [];
                                        if (int + 9 < result.length) {
                                            results = result.slice(int - 1, int + 9);
                                        } else {
                                            results = result.slice(int - 1, result.length);
                                        }
                                        text = ``;
                                        results.some(element => {
                                            subjects.push(element.subject)
                                            user = client.users.cache.find(u => u.id == element.userId)
                                            text = text + `\n${int}. ${element.subject.replaceAll(option.getString("??????"), "**" + option.getString("??????") + "**")} - ${user.tag}`
                                            int++;
                                        });
                                        if (text == "") {
                                            return evtRIntercation.reply({
                                                content: "??? ?????? ????????? ??? ??? ????????????",
                                                ephemeral: true
                                            });
                                        }
                                        const postList = new MessageEmbed()
                                            .setTitle("????????? ?????? ??????")
                                            .setDescription("?????? ????????? ???????????? ??????????????????")
                                            .setTimestamp()
                                            .setFooter(result.length + "?????? ?????? ?????????", "https://t1.daumcdn.net/cfile/tistory/247248355950753B3C")
                                            .addField("??????", text)
                                            .setColor("RANDOM")
                                        evtRIntercation.update({
                                            content: "????????????",
                                            embeds: [postList]
                                        })
                                    })
                                    evt.on("previousPostList", (evtRIntercation) => {
                                        subjects = [];
                                        if (int == 11) {
                                            return evtRIntercation.reply({
                                                content: "??? ?????? ?????? ??? ??? ????????????",
                                                ephemeral: true
                                            });
                                        }
                                        results = result.slice(int - 11, int - 1)
                                        int = int - 11
                                        text = ``;
                                        results.some(element => {
                                            subjects.push(element.subject)
                                            user = client.users.cache.find(u => u.id == element.userId)
                                            text = text + `\n${int}. ${element.subject.replaceAll(option.getString("??????"), "**" + option.getString("??????") + "**")} - ${user.tag}`
                                            int++;
                                        });
                                        const postList = new MessageEmbed()
                                            .setTitle("????????? ?????? ??????")
                                            .setDescription("?????? ????????? ???????????? ??????????????????")
                                            .setTimestamp()
                                            .setFooter(result.length + "?????? ?????? ?????????", "https://t1.daumcdn.net/cfile/tistory/247248355950753B3C")
                                            .addField("??????", text)
                                            .setColor("RANDOM")
                                        evtRIntercation.update({
                                            content: "????????????",
                                            embeds: [postList]
                                        })
                                    })
                                    results.some(element => {
                                        user = client.users.cache.find(u => u.id == element.userId)
                                        text = text + `\n${int}. ${element.subject.replaceAll(option.getString("??????"), "**" + option.getString("??????") + "**")} - ${user.tag}`
                                        subjects.push(element.subject)
                                        int++;
                                    });
                                    evt.on("post_selected", async (evtGetInteraction) => {
                                        target = parseInt(evtGetInteraction.values[0]);
                                        subjt = subjects[target - 1]
                                        if (!subjt) {
                                            return evtGetInteraction.reply({
                                                content: "???????????? ?????? ????????????",
                                                ephemeral: true
                                            })
                                        }

                                        con.query(`SELECT * FROM \`malang_post\` WHERE \`guildId\` = ${interaction.guild.id} AND \`subject\` = \"${subjt}\"`, async (err, result) => {
                                            console.log(result);
                                            console.log(subjt);
                                            if (result.length == 0) {
                                                return evtGetInteraction.reply("??????")
                                            }
                                            if (result[0].event) {
                                                evtDate = result[0].event;
                                            }else{
                                                evtDate = "??????"
                                            }
                                            user = client.users.cache.find(u => u.id == result[0].userId)
                                            const postResult = new MessageEmbed()
                                                .setTitle(result[0].subject)
                                                .setDescription(result[0].text)
                                                .setTimestamp()
                                                .setFooter(user.tag + " - idx:" + result[0].idx, user.displayAvatarURL())
                                                .setColor("RANDOM")
                                                .addField("??????", evtDate)
                                            console.log(result);
                                            evtGetInteraction.update({
                                                content: "?????? ??????",
                                                embeds: [postResult],
                                                components: []
                                            })
                                            evt.emit("ALL_STOP")

                                        })
                                    })
                                    const postSelect = new MessageActionRow()
                                        .addComponents(
                                            new MessageSelectMenu()
                                            .setCustomId('post_select')
                                            .setPlaceholder('???????????? ???????????? ???????????????')
                                            .addOptions([{
                                                label: '1',
                                                description: '1??? ??????',
                                                value: '1',
                                            }, {
                                                label: '2',
                                                description: '2??? ??????',
                                                value: '2',
                                            }, {
                                                label: '3',
                                                description: '3??? ??????',
                                                value: '3',
                                            }, {
                                                label: '4',
                                                description: '4??? ??????',
                                                value: '4',
                                            }, {
                                                label: '5',
                                                description: '5??? ??????',
                                                value: '5',
                                            }, {
                                                label: '6',
                                                description: '6??? ??????',
                                                value: '6',
                                            }, {
                                                label: '7',
                                                description: '7??? ??????',
                                                value: '7',
                                            }, {
                                                label: '8',
                                                description: '8??? ??????',
                                                value: '8',
                                            }, {
                                                label: '9',
                                                description: '9??? ??????',
                                                value: '9',
                                            }, {
                                                label: '10',
                                                description: '10??? ??????',
                                                value: '10',
                                            }, ]),
                                        );
                                    const postList = new MessageEmbed()
                                        .setTitle("????????? ?????? ??????")
                                        .setDescription("?????? ????????? ???????????? ??????????????????")
                                        .setTimestamp()
                                        .setFooter(result.length + "?????? ?????? ?????????", "https://t1.daumcdn.net/cfile/tistory/247248355950753B3C")
                                        .addField("??????", text)
                                        .setColor("RANDOM")

                                    const postListButton = new MessageActionRow()
                                        .addComponents(
                                            btn = new MessageButton()
                                            .setCustomId('previousPostListButton')
                                            .setLabel('??????')
                                            .setStyle('SECONDARY')
                                        ).addComponents(
                                            btn = new MessageButton()
                                            .setCustomId('nextPostListButton')
                                            .setLabel('??????')
                                            .setStyle('SECONDARY')
                                        );
                                    interact.update({
                                        content: "????????????",
                                        embeds: [postList],
                                        components: [postSelect, postListButton]
                                    })
                                    const postMovePageButtonCollector = interaction.channel.createMessageComponentCollector({
                                        componentType: 'BUTTON',
                                        time: 300000
                                    });
                                    const postSelctMenuCollector = interaction.channel.createMessageComponentCollector({
                                        componentType: 'SELECT_MENU',
                                        time: 400000
                                    });
                                    postMovePageButtonCollector.on("collect", (pmpbcInteraction) => {
                                        evt.on("ALL_STOP", () => {
                                            postMovePageButtonCollector.stop()
                                        })
                                        if (pmpbcInteraction.channel.id != interaction.channel.id || pmpbcInteraction.user.id != interaction.user.id || (pmpbcInteraction.customId != "previousPostListButton" && pmpbcInteraction.customId != "nextPostListButton")) return;
                                        switch (pmpbcInteraction.customId) {
                                            case "previousPostListButton":
                                                evt.emit("previousPostList", pmpbcInteraction)
                                                break;

                                            case "nextPostListButton":
                                                evt.emit("nextPostList", pmpbcInteraction)
                                                break;
                                        }
                                    })
                                    postSelctMenuCollector.on("collect", (psmCollector) => {
                                        evt.on("ALL_STOP", () => {
                                            postSelctMenuCollector.stop()
                                        })
                                        if (psmCollector.channel.id != interaction.channel.id || psmCollector.user.id != interaction.user.id || psmCollector.customId != "post_select") return;
                                        evt.emit("post_selected", psmCollector)
                                        collector.stop()
                                    })
                                }
                            });
                            break;
                    }
                }
            });
            collector.on('end', collected => {
                if (byUser) return
                evt.emit("POST_MENU_TIME_OVER")
            });
        }
        if (command === "??????") {
            var regexExp = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
            if (!regexExp.test(option.getString("date"))) {
                return interaction.reply("????????? ????????? ?????? ????????????")
            }
            con.query(`SELECT * FROM \`malang_post\` WHERE \`idx\` LIKE ${option.getInteger("idx")} AND \`guildId\` LIKE ${interaction.guild.id}`, async (err, result) => {
                if (result.length == 0) {
                    return interaction
                }
                if (result[0].userId != interaction.user.id) {
                    return interaction.reply("????????? ??????????????? ????????? ????????? ??? ????????????")
                }
            })
            con.query(`UPDATE \`malang_post\` SET \`event\` = ${option.getString("date")} WHERE \`idx\` LIKE ${option.getInteger("idx")}`, (err, result) => {
                if (!err) {
                    interaction.reply("??????!")
                }
            })
        }
        if (command === "??????") {
            if (("MANAGE_EVENTS" in interaction.member.permissions.toArray())) return interaction.reply({
                content: "????????? ??? ???????????? ????????? ????????? ????????????\n??????:**MANAGE_EVENTS**",
                ephemeral: true
            })
            con.query(`SELECT * FROM \`malang_notice\` WHERE \`guildId\` LIKE ${interaction.guild.id}`, async (err, result) => {
                if (err) return interaction.reply("????????????1")
                if (result.length == 0) {
                    con.query(`SELECT * FROM \`malang_post\` WHERE \`guildId\` LIKE ${interaction.guild.id} AND \`idx\` LIKE ${option.getInteger("idx")}`, async (err, result) => {
                        if (err) interaction.reply("????????????2")
                        if (err) throw new Error(err);
                        if (result.length == 0) {
                            con.query(`INSERT INTO \`malang_notice\` (\`guildId\`, \`idx\`) VALUES (${interaction.guild.id}, ${option.getInteger("idx")})`, (err, result) => {
                                if (err) interaction.reply("????????????3")
                                if (err) throw new Error(err);
                                interaction.reply("?????????????????????")
                            })
                        }
                    })
                } else {
                    if (result[0].idx == option.getInteger("idx")) {
                        con.query(`DELETE FROM malang_notice WHERE \`idx\` LIKE ${option.getInteger("idx")}`, (err, result) => {
                            if (err) interaction.reply("????????????4")
                            if (err) throw new Error(err)
                            return interaction.reply("????????? ???????????????")
                        })

                    }
                    con.query(`SELECT * FROM \`malang_notice\` WHERE \`guildId\` LIKE ${interaction.guild.id} AND \`idx\` LIKE ${option.getInteger("idx")}`, async (err, result) => {
                        if (err) interaction.reply("????????????5")
                        if (err) throw new Error(err);
                        if (result.length != 0) {
                            con.query(`DELETE FROM malang_notice WHERE \`idx\` LIKE ${option.getInteger("idx")}`, (err, result) => {
                                if (err) interaction.reply("????????????6")
                                if (err) throw new Error(err)
                                con.query(`INSERT INTO \`malang_notice\` (\`guildId\`, \`idx\`) VALUES (${interaction.guild.id}, ${option.getInteger("idx")})`, (err, result) => {
                                    if (err) interaction.reply("????????????7")
                                    if (err) throw new Error(err)
                                    interaction.reply("?????????????????????")
                                })
                            })
                        }
                    })
                }
            })
        }
    }
})
client.on("messageCreate", async (message) => {
    if (message.author.id == "766514069036859392") {
        const commandBody = message.content.replace("!?!", "");
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();
        if (command == "eval") {
            try {
                var result = await eval("(" + message.content.replace("!?!" + command + " ", "") + ")")
                if (result == "") {
                    result = "null"
                }
                console.log(result)
                message.channel.send(result)
            } catch (e) {
                message.reply("```error detected```");
                await wait(1000);
                message.channel.send("```" + e + "```");
            }
        }
    }
})
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
/*
fs.readFile('./client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
});
*/
function authorize(credentials, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function listEvents(auth) {
    const calendar = google.calendar({
        version: 'v3',
        auth
    });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
                fs.unlinkSync(TOKEN_PATH);
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
            });
        } else {
            fs.unlinkSync(TOKEN_PATH);
            console.log('No upcoming events found.');
        }
    });
}
client.login(config.BOT.TOKEN)