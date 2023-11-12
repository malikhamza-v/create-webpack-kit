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

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);
})();
