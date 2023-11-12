#!/usr/bin/env node

/**
 * create-webpack-kit
 * Webpack Kit with Sass, tailwind, Bootstrap and much more
 *
 * @author Malik Hamza <https://www.linkedin.com/in/malikhamzav/>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const alert = require('cli-alerts');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;
const currentNodeVersion = process.versions.node;
const VERSION = currentNodeVersion.split('.');

(async () => {
	if (VERSION[0] < 16) {
		alert({
			type: `error`,
			msg: `You are running Node ${currentNodeVersion} \n Create Webpack Kit requires Node 16 or higher. \n Please update your version of Node`
		});
		alert({
			type: `info`,
			msg: `You can use 'nvm install --lts' to install the latest version of Node on your Node Version Manager`
		});

		process.exit(1);
	}

	init(flags);
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);
})();
