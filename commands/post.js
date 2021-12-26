const {
    SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('게시글')
        .setDescription('게시글 gui를 띄웁니다')
        .addStringOption(option => 
            option.setName("제목")
            .setDescription("게시글의 제목을 입력합니다. 게시글의 작성, 열람등에 사용됩니다")
            .setRequired(true))
};