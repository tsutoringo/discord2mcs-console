const Discord = require('discord.js');
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILD_INTEGRATIONS, Discord.Intents.FLAGS.GUILD_MESSAGES]});

const config = require('./config.js');
const StackableLog = require('./StackableLog.js');

let running = void 0;

client.on('interaction', async interaction => {

	if (!interaction.isCommand()) return;
	if (!config.admins.includes(interaction.user.id)) {
		await interaction.reply('権限がありません。');
		return;
	}

	switch (interaction.commandName) {
		case 'start':
			if (running) {
				await interaction.reply('すでにサーバーは実行中です');
			} else {
				await interaction.reply('サーバーを起動します');
				await client.user.setPresence({ activities: [{'name': '工業鯖起動中'}], status: 'WATCHING' });
				const channel = await client.channels.fetch(config.consoleChannelID);
				running = new StackableLog(config.runCommand);
				running.on('log', logs => {
					channel.send(logs.join('\n'));
				});
				running.process.on('close', async () => {
					await client.user.setPresence({ activities: [], status: 'invisible' });
					await channel.send(`[${client.user.tag}] Process closed`);
					running = void 0;
				});
			}
			break;
	}
});

client.on('message', msg => {
	const { channel } = msg;
	if (msg.author.bot) return;

	if (channel.id === config.consoleChannelID && running) {
		running.process.stdin.write(msg.content + '\r');
	}
})

client.on('ready', async () => {
	console.log('ready...');
	await client.user.setPresence({ activities: [], status: 'invisible' });
})

client.login(config.token);
