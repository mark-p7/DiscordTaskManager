const { SlashCommandBuilder, Events, ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require('discord.js');
const TaskModel = require('../models/task.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-task')
		.setDescription('Sets a task for the user to complete.'),
	// .addStringOption(option => option.setName('input').setDescription('The input to set the name of the task created.')),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('set-task-modal')
			.setTitle('My Modal');

		// Add components to modal

		// Create the text input components
		const taskNameInput = new TextInputBuilder()
			.setCustomId('taskNameInput')
			// The label is the prompt the user sees for this input
			.setLabel("Provide a name for your task")
			// Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const taskDescriptionInput = new TextInputBuilder()
			.setCustomId('taskDescriptionInput')
			.setLabel("Provide a description for your task")
			// Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// #TODO: Add a date picker component

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(taskNameInput);
		const secondActionRow = new ActionRowBuilder().addComponents(taskDescriptionInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
		return;
	},
};