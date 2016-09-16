import * as chalk from 'chalk';
import * as path from 'path';
import * as yeomanGenerator from 'yeoman-generator';
import yosay = require('yosay');

const tplFiles = require('./files');

class GiuseppeGenerator extends yeomanGenerator.Base {
    private userInput: any = {};

    public initializing() {
        this.log(yosay(`Welcome to the ${chalk.blue('giuseppe')} generator, I'll compose a giuseppe app for you.`));
    }

    public prompting() {
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
                default: 'false'
            }, {
                type: 'input',
                name: 'rootFolderName',
                message: 'The name of your root folder',
                default: (options: any) => options.name.split(' ').join('-'),
                when: (options: any) => options.createRootFolder
            }, {
                type: 'confirm',
                name: 'createDemoController',
                message: 'Create a demo controller',
                default: 'true'
            }, {
                type: 'confirm',
                name: 'needTest',
                message: `Do you need a testing framework ${chalk.dim('(mocha and chai)')}`,
                default: 'true'
            }, {
                type: 'confirm',
                name: 'needAuth',
                message: `Do you need authentication ${chalk.dim('(passport.js)')}`,
                default: 'false'
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
                    }, {
                        name: 'Local auth (user / pass)',
                        value: 'local',
                        short: 'Local'
                    }
                ],
                when: (options: any) => options.needAuth
            }
        ]).then(answers => {
            this.userInput = answers;
        });
    }

    public configuring() {
        this.log(`${chalk.blue('Configure')} - configuring your web app.`);

        if (this.userInput.createRootFolder) {
            this.destinationRoot(path.join(this.destinationRoot(), this.userInput.rootFolderName));
        }
    }

    public writing() {
        this.log(`${chalk.blue('Write')} - writing files.`);

        tplFiles(this).forEach(o => this.fs.copyTpl(o.from, o.to, o.data));
    }

    public install() {
        this.log(`${chalk.blue('Install')} - installing dependencies ${chalk.dim('(npm and typings)')}.`);

        let deps = ['giuseppe', 'express', 'body-parser'],
            devDeps = ['del-cli', 'typescript', 'typings', 'tslint'],
            globalTypings = ['dt~express', 'dt~express-serve-static-core', 'dt~http-status', 'dt~mime', 'dt~node', 'dt~serve-static', 'dt~body-parser'],
            devTypings = [],
            devGlobalTypings = [];

        if (this.userInput.needAuth) {
            deps.push('passport');
            globalTypings.push('dt~passport');

            if (this.userInput.passportPlugins.indexOf('bearer') > -1) {
                deps.push('passport-http-bearer');
                globalTypings.push('dt~passport-http-bearer');
            }

            if (this.userInput.passportPlugins.indexOf('basic') > -1) {
                deps.push('passport-http');
            }

            if (this.userInput.passportPlugins.indexOf('local') > -1) {
                deps.push('passport-local');
                globalTypings.push('dt~passport-local');
            }
        }

        if (this.userInput.needTest) {
            devDeps.push('mocha', 'chai', 'istanbul')
            devTypings.push('chai');
            devGlobalTypings.push('dt~mocha');
        }

        if (this.userInput.esVersion !== 'es6') {
            globalTypings.push('dt~es6-shim');
        }

        this.npmInstall(deps, { save: true, q: true });
        this.npmInstall(devDeps, { saveDev: true, q: true });
        (this as any).runInstall('typings', globalTypings, { save: true, global: true });
        if (devTypings.length) (this as any).runInstall('typings', devTypings, { saveDev: true });
        if (devGlobalTypings.length) (this as any).runInstall('typings', devGlobalTypings, { saveDev: true, global: true });
    }

    public end() {
        this.log(`${chalk.green('\n\nAll done!\n')}`);
        this.log(`To start the app right away use: ${chalk.cyan('npm run build && npm start')}`);
        this.log(`For your everyday development process use: ${chalk.cyan('npm run develop')}`);
        if (this.userInput.needTest) this.log(`To run your unit tests use: ${chalk.cyan('npm test')}`);
        this.log(`For more npm run scripts look at the ${chalk.yellow('package.json')} or use: ${chalk.cyan('npm run')}`);
        this.log(`${chalk.green('\nHave fun using giuseppe :-)')}`);
    }
}

module.exports = GiuseppeGenerator;