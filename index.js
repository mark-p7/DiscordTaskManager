const fs = require('node:fs');
const path = require('node:path');
const {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	SlashCommandBuilder,
	ModalBuilder,
	TextInputStyle,
	TextInputBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	EmbedBuilder } = require('discord.js');
const { token, guildId, clientId } = require('./config.json');
const TaskModel = require('./models/task.js');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Connect to MongoDB
dotenv.config();
const connStringLocal = "mongodb://localhost:27017/TaskManager"
mongoose.connect(process.env.DB_STRING || connStringLocal);

async function startup() {
	// Drop database
	// await TaskModel.db.dropDatabase();
	// Create Unique Index
	// await TaskModel.db.collection('tasks').createIndex({ "id": 1 }, { unique: true })

	client.login(token);
}

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

const commandList =
	"To view your tasks, type `/tasks`.\n" +
	"To edit a task, type `/edit-task`.\n" +
	"To view a task, type `/view-task`.\n" +
	"To mark a task as completed, type `/complete-task`.\n" +
	"To delete a task, type `/delete-task`.\n" +
	"To delete all tasks, type `/delete-all-tasks`.\n" +
	"To delete all completed tasks, type `/delete-completed-tasks`.\n" +
	"To delete all incomplete tasks, type `/delete-incomplete-tasks`.\n" +
	"To view the help menu, type `/help`.\n";

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'set-task-modal') {
		// console.log(interaction.fields.getTextInputValue('taskNameInput'));
		// console.log(interaction.fields.getTextInputValue('taskDescriptionInput'));
		const task = await TaskModel.create({
			id: interaction.id,
			name: interaction.fields.getTextInputValue('taskNameInput'),
			description: interaction.fields.getTextInputValue('taskDescriptionInput'),
			userId: interaction.user.id,
			completed: false,
		}).catch(async err => {
			console.log(err)
			await interaction.reply({ content: 'There was an error while creating your task!', ephemeral: true });
			return;
		});
		if (task) {
			await interaction.reply({
				content: 'Your task has been created!\n' +
					`Name: ${task.name}\n` +
					`Description: ${task.description}\n` +
					`Completed: ${task.completed}\n` +
					`\n\n${commandList}`,
				ephemeral: true
			});
			return;
		};
		await interaction.reply({ content: 'There was an error while creating your task!', ephemeral: true });
		return;
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;
	if (interaction.customId === 'view-task-select') {
		const task = await TaskModel.findOne({ id: interaction.values[0] });
		if (!task) {
			await interaction.reply({ content: 'There was an error while retrieving your task!', ephemeral: true });
			return;
		}
		await interaction.reply({
			content: 'Your task has been retrieved!\n' +
				`Name: ${task.name}\n` +
				`Description: ${task.description}\n` +
				`Completed: ${task.completed}\n` +
				`\n\n${commandList}`,
			ephemeral: true
		});
	}
	if (interaction.customId === 'view-task-select') {
		const task = await TaskModel.findOne({ id: interaction.values[0] });
		if (!task) {
			await interaction.reply({ content: 'There was an error while retrieving your task!', ephemeral: true });
			return;
		}
		await interaction.reply({
			content: 'Your task has been retrieved!\n' +
				`Name: ${task.name}\n` +
				`Description: ${task.description}\n` +
				`Completed: ${task.completed}\n` +
				`\n\n${commandList}`,
			ephemeral: true
		});
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

startup();