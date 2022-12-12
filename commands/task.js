const { SlashCommandBuilder, StringSelectMenuBuilder, Events, ActionRowBuilder } = require('discord.js');
const TaskModel = require('../models/task.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('task')
		.setDescription('Returns a task.'),
	async execute(interaction) {
		const tasks = await TaskModel.find({ userId: interaction.user.id }).catch(err => {
			console.log(err)
			return interaction.reply('There was an error fetching your tasks.');
		});
		if (!tasks.length) {
			return interaction.reply('You have no tasks!');
		}
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('view-task-select')
                    .setPlaceholder('Nothing selected')
                    .addOptions(tasks.map(task => {
                        return {
                            label: task.name,
                            description: task.description,
                            value: task.id,
                        }
                    }))
            );
        await interaction.reply({ content: 'Select a task', components: [row] });
		return;
	},
};