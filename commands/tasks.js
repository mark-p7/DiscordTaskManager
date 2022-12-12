const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tasks')
		.setDescription('Returns all the tasks for the user.')
		.addStringOption(option => option.setName('input').setDescription('The input to set the name of the task created.')),
	async execute(interaction) {
		return interaction.reply('Here are your tasks:');
	},
};