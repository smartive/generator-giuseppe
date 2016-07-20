const generators = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk');

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
        console.log(this.userInput);
    }
}

module.exports = GiuseppeGenerator;