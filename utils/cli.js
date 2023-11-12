const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	project_name: {
		type: `string`,
		default:
			(process.argv.slice(2)[0] === 'help'
				? 'undefined'
				: process.argv.slice(2)[0]) || 'undefined',
		alias: 'p',
		desc: `Specify project name`
	},
	template: {
		type: `string`,
		default: 'undefined',
		alias: `t`,
		desc: `Choose template [javascript | typescript]`
	},
	ui_library: {
		type: `string`,
		default: 'undefined',
		desc: `Choose UI Library [tailwind | bootstrap | none]`
	},
	sass: {
		type: `string`,
		default: 'undefined',
		desc: `Whould you like to use Sass [true | false]`
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `create-webpack-kit`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
