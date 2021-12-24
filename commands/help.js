const {
    SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('도움말')
        .setDescription('도움말을 출력합니다')
};