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
                name: 'createDefaultController',
                message: 'Create a default controller',
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
        if (this.userInput.createRootFolder) {
            this.destinationRoot(path.join(this.destinationRoot(), this.userInput.rootFolderName));
        }
    }

    writing() {
        tplFiles(this).forEach(o => this.fs.copyTpl(o.from, o.to, o.data));
    }
}

module.exports = GiuseppeGenerator;