const { SlashCommandBuilder } = require('discord.js');
const TaskModel = require('../models/task.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tasks')
		.setDescription('Returns all the tasks for the user.'),
	async execute(interaction) {
		const tasks = await TaskModel.find({ userId: interaction.user.id }).catch(err => {
			console.log(err)
			return interaction.reply('There was an error fetching your tasks.');
		});
		if (!tasks.length) {
			return interaction.reply('You have no tasks!');
		}
		let response = 'Here are your tasks:\n';
		tasks.forEach((task, i) => {
			response += `${i + 1}) ${task.name}\n`;
		});
		return interaction.reply(response);
	},
};