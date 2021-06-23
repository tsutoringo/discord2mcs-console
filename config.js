require('dotenv').config();

module.exports = {
    guildID: '856786814949916722',
    consoleChannelID: '856787322019250186',
    token: process.env.DISCORD_BOT,
    runCommand: ['sh', ['./start.sh']],
    admins: ['312508907002265600']
};
