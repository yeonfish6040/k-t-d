const {
    SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('게시글')
        .setDescription('게시글 gui를 띄웁니다')
};