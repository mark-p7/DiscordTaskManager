const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require('discord.js');
const { token, guildId, clientId } = require('./config.json');
const TaskModel = require('./models/task.js');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Connect to MongoDB
dotenv.config();
const connStringLocal = "mongodb://localhost:27017/TaskManager"
mongoose.connect(process.env.DB_STRING || connStringLocal);

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'set-task-modal') {
		console.log(interaction.fields.getTextInputValue('taskNameInput'));
		console.log(interaction.fields.getTextInputValue('taskDescriptionInput'));
		const task = await TaskModel.create({
			name: interaction.fields.getTextInputValue('taskNameInput'),
			description: interaction.fields.getTextInputValue('taskDescriptionInput'),
			userId: interaction.user.id,
			completed: false,
		}).catch(async err =>{ 
			console.log(err) 
			await interaction.reply({ content: 'There was an error while creating your task!', ephemeral: true });
			return;
		});
		if (task) {
			await interaction.reply({ content: 'Your task has been created!' });
			return;
		};
		await interaction.reply({ content: 'There was an error while creating your task!', ephemeral: true });
		return;
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);