const {
    SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('핑')
        .setDescription('핑을 출력합니다')
};