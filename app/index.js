const generators = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    path = require('path');

const tplFiles = require('./files');

class GiuseppeGenerator extends generators.Base {
    constructor(args, options) {
        super(args, options);
        this.userInput = {};
    }

    initializing() {
        this.log(yosay(`Welcome to the ${chalk.blue('giuseppe')} generator, I'll compose a giuseppe app for you.`));
    }

    prompting() {
        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'The name of your app',
                default: this.appname
            }, {
                type: 'list',
                name: 'esVersion',
                message: 'Which javascript version do you want?',
                choices: [
                    {
                        name: 'ES 3',
                        value: 'es3'
                    }, {
                        name: 'ES 5',
                        value: 'es5'
                    }, {
                        name: 'ES 6',
                        value: 'es6'
                    }
                ],
                default: 'es5'
            }, {
                type: 'confirm',
                name: 'createRootFolder',
                message: 'Create a root folder for the app',
                default: false
            }, {
                type: 'input',
                name: 'rootFolderName',
                message: 'The name of your root folder',
                default: options => options.name.split(' ').join('-'),
                when: options => options.createRootFolder
            }, {
                type: 'confirm',
                name: 'createDemoController',
                message: 'Create a demo controller',
                default: true
            }, {
                type: 'confirm',
                name: 'needAuth',
                message: `Do you need authentication ${chalk.dim('(passport.js)')}`,
                default: false
            }, {
                type: 'checkbox',
                name: 'passportPlugins',
                message: 'Which authentications do you need (more available at passportjs.org)',
                choices: [
                    {
                        name: 'Bearer token',
                        value: 'bearer',
                        short: 'Bearer'
                    }, {
                        name: 'HTTP basic auth',
                        value: 'basic',
                        short: 'Basic'
                    }
                ],
                when: options => options.needAuth
            }
        ]).then(answers => {
            this.userInput = answers;
        });
    }

    configuring() {
        this.log(`${chalk.blue('Configure')} - configuring your web app.`);

        if (this.userInput.createRootFolder) {
            this.destinationRoot(path.join(this.destinationRoot(), this.userInput.rootFolderName));
        }
    }

    writing() {
        this.log(`${chalk.blue('Write')} - writing files.`);

        tplFiles(this).forEach(o => this.fs.copyTpl(o.from, o.to, o.data));
    }

    install() {
        this.log(`${chalk.blue('Install')} - installing dependencies ${chalk.dim('(npm and typings)')}.`);

        let deps = ['giuseppe', 'express', 'body-parser'],
            devDeps = ['typescript', 'typings', 'tslint'],
            globalTypings = ['dt~express', 'dt~express-serve-static-core', 'dt~http-status', 'dt~mime', 'dt~node', 'dt~serve-static'],
            devTypings = [],
            devGlobalTypings = [];

        this.npmInstall(deps, { save: true });
        this.npmInstall(devDeps, { saveDev: true });
        this.runInstall('typings', globalTypings, { save: true, global: true });
        
        if (this.userInput.testing) {
            devTypings.push('chai');
            devGlobalTypings.push('dt~mocha');

            this.runInstall('typings', devTypings, { saveDev: true });
            this.runInstall('typings', devGlobalTypings, { saveDev: true, global: true });
        }
    }

    end() {
        this.log(`${chalk.green('\n\nAll done!\n')}`);
        this.log(`To start the app right away use: ${chalk.cyan('npm run build && npm start')}`);
        this.log(`For your everyday development process use: ${chalk.cyan('npm run develop')}`);
        this.log(`For more npm run scripts look at the ${chalk.yellow('package.json')} or use: ${chalk.cyan('npm run')}`);
        this.log(`${chalk.green('\nHave fun using giuseppe :-)')}`);
    }
}

module.exports = GiuseppeGenerator;