const {
    SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('공지')
        .setDescription('공지를 등록하거나 내립니다')
        .addIntegerOption(option => 
            option.setName("idx")
            .setDescription("idx를 입력하세요 게시글을 열람하시면 제일 하단분 footer에 idx가 있습니다")
            .setRequired(true))
};