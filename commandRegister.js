const Discord = require('discord.js');
const client = new Discord.Client({intents: []});

const config = require('./config.js');
const commands = require('./commands.js');

client.on('ready', async () => {
    await client.guilds.cache.get(config.guildID).commands.create(commands.start);
    await client.guilds.cache.get(config.guildID).commands.create(commands.stop);
    client.destroy();
    process.exit(0);
});

client.login(config.token);
