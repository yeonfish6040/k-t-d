const {
    SlashCommandBuilder
} = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('일정')
        .setDescription('일정을 등록합니다')
        .addIntegerOption(option => 
            option.setName("idx")
            .setDescription("idx를 입력하세요 게시글을 열람하시면 제일 하단분 footer에 idx가 있습니다")
            .setRequired(true))
        .addIntegerOption(option => 
            option.setName("date")
            .setDescription("날짜를 입력하세요 yyyy-mm-dd 형식입니다")
            .setRequired(true))
};