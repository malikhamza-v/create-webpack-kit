const welcome = require('cli-welcome');
const pkg = require('./../package.json');
const unhandled = require('cli-handle-unhandled');
const inquirer = require('inquirer');

async function promptForMissingOptions(options) {
	return await inquirer
		.prompt([
			{
				type: 'input',
				name: 'projectName',
				message: 'Enter Project Name',
				when: options.projectName === 'undefined',
				validate: input => !!input
			},
			{
				type: 'list',
				name: 'template',
				message: 'Which template do you want to use?',
				when: options.template === 'undefined',
				choices: ['javascript', 'typescript']
			},
			{
				type: 'list',
				name: 'sass',
				message: 'Would you like to user sass?',
				when: options.sass === 'undefined',
				choices: ['no', 'yes']
			},
			{
				type: 'list',
				name: 'uiLibrary',
				message: 'Which UI library would you like to add?',
				when: options.uiLibrary === 'undefined',
				choices: ['none', 'tailwind', 'bootstrap']
			}
		])
		.then(answers => {
			if (answers.sass) {
				if (answers.sass === 'yes') {
					answers.sass = true;
				} else {
					answers.sass = false;
				}
			}
			return {
				...options,
				...answers
			};
		});
}

module.exports = async flags => {
	unhandled();
	welcome({
		title: `create-webpack-kit`,
		tagLine: `by Malik Hamza`,
		description: pkg.description,
		version: pkg.version,
		bgColor: '#36BB09',
		color: '#000000',
		bold: true,
		clear: flags.clear
	});
	await promptForMissingOptions(flags);
};
