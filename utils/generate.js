const fs = require('fs');

const execa = require('execa');
const ora = require('ora');
const path = require('path');
const alert = require('cli-alerts');

var projectFolder;

function createPackageJson(options) {
	const packageJson = {
		name: projectFolder,
		version: '1.0.0',
		description: 'Webpack Folder created wil create-my-webpack',
		main: 'index.js',
		scripts: {
			dev: 'webpack serve',
			build: 'webpack'
		},
		keywords: [],
		author: '',
		license: 'ISC',
		dependencies: {},
		devDependencies: {
			webpack: '^5.88.2',
			'webpack-cli': '^5.1.4',
			'style-loader': '^3.3.3',
			'css-loader': '^6.8.1',
			'html-webpack-plugin': '^5.5.3',
			'webpack-dev-server': '^4.15.1',
			'babel-loader': '^9.1.3',
			'@babel/core': '^7.23.0',
			'@babel/preset-env': '^7.22.20'
		}
	};

	if (options.template === 'typescript') {
		packageJson.devDependencies['typescript'] = '^5.2.2';
		packageJson.devDependencies['ts-loader'] = '^9.5.0';
	}

	if (options.sass === 'yes') {
		packageJson.devDependencies['sass'] = '^1.69.5';
		packageJson.devDependencies['sass-loader'] = '^13.3.2';
	}

	if (options.sass === 'yes' && options.uiLibrary === 'tailwind') {
		packageJson.devDependencies['@tailwindcss/nesting'] =
			'^0.0.0-insiders.565cd3e';
		packageJson.devDependencies['postcss-import'] = '^15.1.0';
		packageJson.devDependencies['postcss-nesting'] = '^12.0.1';
	}

	if (options.uiLibrary === 'bootstrap') {
		packageJson.dependencies['bootstrap'] = '^5.3.2';
		packageJson.dependencies['@popperjs/core'] = '^2.11.8';
	}

	if (options.uiLibrary === 'tailwind') {
		packageJson.devDependencies['tailwindcss'] = '^3.3.5';
		packageJson.devDependencies['postcss'] = '^8.4.31';
		packageJson.devDependencies['autoprefixer'] = '^10.4.16';
		packageJson.devDependencies['postcss-loader'] = '^7.3.3';
	} else if (options.uiLibrary === 'bootstrap') {
		// TODO: Configure Bootstrap
	}

	fs.writeFileSync(
		`${projectFolder}/package.json`,
		JSON.stringify(packageJson, null, 2)
	);
}

function createWebpackConfig(options) {
	const webpackConfigContent = `const path = require("path");
  const HtmlWebpackPlugin = require("html-webpack-plugin")
  module.exports = {
    mode: "development",
    entry: {
      bundle: path.resolve(__dirname, ${
			options.template === 'javascript' ? `'main.js'` : `'main.ts'`
		}),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name][contenthash].js",
      clean: true,
      assetModuleFilename: '[name][ext]'
    },
    devtool: 'source-map',
    devServer: {
      static:{
        directory: path.resolve(__dirname, 'dist')
      },
      port: 3000,
      watchFiles: ["./*.html"],
      open: true,
      hot: true,
      compress: true,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\\.css$/,
          use: ['style-loader', ${
				options.uiLibrary === 'tailwind'
					? `, {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'`
					: "'css-loader'"
			}]
        },
        ${
			options.sass === 'yes'
				? `{
          test: /\\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
            ${
				options.uiLibrary === 'tailwind' && options.sass === 'yes'
					? ', `postcss-loader`'
					: ''
			}
          ]
        },`
				: ''
		}
        ${
			options.template === 'typescript'
				? `{
          test: /\\.ts(x)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        },`
				: ''
		}
        {
          test: /\\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        }
      ]
    },
    ${
		options.template === 'typescript'
			? `resolve: {
        extensions: [
          '.tsx',
          '.ts',
          '.js'
        ]
      },`
			: ''
	}
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack APP',
        filename: 'index.html',
        template: 'template.html'
      })
    ]
  };`;

	fs.writeFileSync(
		`${projectFolder}/webpack.config.js`,
		webpackConfigContent
	);
}

function createTsConfigFile() {
	const tsConfig = {
		compilerOptions: {
			outDir: './dist/',
			sourceMap: true,
			strict: true,
			noImplicitReturns: true,
			noImplicitAny: true,
			module: 'es6',
			moduleResolution: 'node',
			target: 'es5',
			allowJs: true
		},
		include: ['./src/js/*', './main.ts']
	};

	fs.writeFileSync(
		`${projectFolder}/tsconfig.json`,
		JSON.stringify(tsConfig, null, 2)
	);
}

function createPostCssConfig(options) {
	const postcssConfig = `module.exports = {
      plugins: [
        ${
			options.sass === 'yes' && options.uiLibrary === 'tailwind'
				? `require("tailwindcss/nesting")(require("postcss-nesting")), 
            require('postcss-import'),
            `
				: ''
		}
        require('tailwindcss'),
        require('autoprefixer')
      ]
    };`;

	fs.writeFileSync(`${projectFolder}/postcss.config.js`, postcssConfig);
}

function createTailwindConfig() {
	const tailwindConfig = `module.exports = {
    content: ["./*.html"],
    theme: {
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [],
    };`;

	fs.writeFileSync(`${projectFolder}/tailwind.config.js`, tailwindConfig);
}

function createSassStyles(options) {
	const sass = `${
		options.uiLibrary === 'tailwind'
			? `@tailwind base;
  @tailwind components;
  @tailwind utilities;`
			: options.uiLibrary === 'bootstrap'
			? `@import "bootstrap/scss/bootstrap";`
			: ''
	}
  body {
    background-color: black;
    color: white;
    h1 {
      display: flex;
      text-align: center;
      font-size: 5rem;
    }
  }`;

	fs.writeFileSync(`${projectFolder}/src/styles/main.scss`, sass);
}

function createCssStyles(options) {
	const css = `${
		options.uiLibrary === 'tailwind'
			? `@tailwind base;
    @tailwind components;
    @tailwind utilities;`
			: options.uiLibrary === 'bootstrap'
			? `@import "bootstrap/dist/css/bootstrap.min.css";`
			: ``
	}
  body {
    background-color: black;
    color: white;
  }
  
  h1 {
    display: flex;
    text-align: center;
    font-size: 5rem;
  }`;
	fs.writeFileSync(`${projectFolder}/src/styles/main.css`, css);
}

function createHtmlAndCss(options) {
	const sourceHtmlFilePath = path.resolve(
		__dirname,
		'../template/html/template.html'
	);
	const destinationHtmlFilePath = path.resolve(
		projectFolder,
		'template.html'
	);
	const htmlContent = fs.readFileSync(sourceHtmlFilePath, 'utf8');
	fs.writeFileSync(destinationHtmlFilePath, htmlContent);
	if (options.sass === 'yes') {
		createSassStyles(options);
	} else {
		createCssStyles(options);
	}
}

function createJsFiles(options) {
	const indexJS = `${
		options.sass === 'yes'
			? "import './src/styles/main.scss'"
			: "import './src/styles/main.css'"
	}
  console.log('[Test]: Hello World')
    `;
	fs.writeFileSync(
		`${projectFolder}/${
			options.template === 'javascript' ? 'main.js' : 'main.ts'
		}`,
		indexJS
	);
}

async function runTerminalCommands() {
	const spinner = ora('Installing dependencies...').start();
	try {
		await execa('npm', ['install'], {
			cwd: projectFolder,
			shell: true
		});
		spinner.stop();
		alert({
			type: 'success',
			msg: `Project created successfully in the ${projectFolder} directory`
		});
		alert({
			type: 'info',
			msg: `Run 'cd ${projectFolder} && npm run dev' to start your local server.`
		});
	} catch (err) {
		console.log('[ERROR]', err);
	} finally {
		spinner.stop();
	}
}

module.exports = options => {
	projectFolder = options.projectName;
	fs.mkdirSync(projectFolder);
	fs.mkdirSync(`${projectFolder}/src`);
	fs.mkdirSync(`${projectFolder}/src/assets`);
	fs.mkdirSync(`${projectFolder}/src/js`);
	fs.mkdirSync(`${projectFolder}/src/styles`);

	createPackageJson(options);
	createWebpackConfig(options);
	if (options.template === 'typescript') {
		createTsConfigFile(options);
	}
	if (options.uiLibrary === 'tailwind') {
		createPostCssConfig(options);
		createTailwindConfig(options);
	}
	createHtmlAndCss(options);
	createJsFiles(options);
	runTerminalCommands();
};
