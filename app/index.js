const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');

class GeneratorOptions {
    constructor(options) {
        this.name = options.name;
        this.needAuth = options.needAuth;
        this.initializeGitRepo = options.initializeGitRepo;
        this.gitUser = options.gitUser;
        this.gitEmail = options.gitEmail;
        this.createPackageFolder = process.cwd().split(/\\|\//).pop() !== this.name;
    }
}

class GiuseppePluginGenerator extends Generator {
    initializing() {
        this.log(yosay(
            `Welcome to the ${chalk.green('giuseppe')} generator, I'll compose a new giuseppe powered webapp for you.`,
        ));
    }

    prompting() {
        return this
            .prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'The name of your app',
                    default: process.cwd().split(/\\|\//).pop(),
                },
                {
                    type: 'confirm',
                    name: 'needAuth',
                    message: `Do you need authentication ${chalk.dim('(passport.js)')}`,
                    default: false,
                },
                {
                    type: 'confirm',
                    name: 'initializeGitRepo',
                    message: 'Should I initialize a git repository?',
                    default: true,
                },
            ])
            .then(answers => {
                answers.gitUser = this.user.git.name();
                answers.gitEmail = this.user.git.email();
                this.options = new GeneratorOptions(answers)
            });
    }

    configuring() {
        this.log(`Configuring your module ${chalk.green(this.options.name)}.`);

        if (this.options.createPackageFolder) {
            this.destinationRoot(path.join(this.destinationRoot(), this.options.name));
        }
    }

    writing() {
        this.log(`Writing template files.`);

        // Base files.
        this._writeTemplate('_gitattributes', '.gitattributes');
        this._writeTemplate('_gitignore', '.gitignore');
        this._copyFile('CHANGELOG.md');
        this._copyFile('jest.json');
        this._writeTemplate('package.json');
        this._writeTemplate('README.md');
        this._copyFile('tsconfig.json');
        this._copyFile('config/tsconfig.base.json');
        this._copyFile('config/tsconfig.build.json');
        this._copyFile('tslint.json');

        // Sources
        this._writeTemplate('src/app.ts');
        this._writeTemplate('src/controller/DemoController.ts');
        if (this.options.needAuth) {
            this._copyFile('src/authentication.ts');
        }

        // Tests
        this._copyFile('test/controller/DemoController.spec.ts');
    }

    install() {
        this.log('Installing dependencies.');

        const deps = [
            'giuseppe',
            'body-parser',
        ];
        const devDeps = [
            '@types/body-parser',
            '@types/express',
            '@types/node',
            '@types/jest',
            'del-cli',
            'jest',
            'ts-jest',
            'tslint',
            'tslint-config-airbnb',
            'tsutils',
            'typescript',
        ];

        if (this.options.needAuth) {
            deps.push('passport');
            deps.push('passport-http-bearer');
            devDeps.push('@types/passport-http-bearer');
            devDeps.push('@types/passport');
        }

        this.spawnCommandSync('npm', ['i', '-S', ...deps]);
        this.spawnCommandSync('npm', ['i', '-D', ...devDeps]);

        if (this.options.initializeGitRepo) {
            this.log('Initializing the git repo.')
            this.spawnCommandSync('git', ['init']);

            this.log('Commiting the base files.');
            this.spawnCommandSync('git', ['add', '.']);
            this.spawnCommandSync('git', ['commit', '-am', '"Initial commit."']);
        }
    }

    end() {
        this.log(`${chalk.green('All done!')}`);
        this.log(`To start coding, run ${chalk.cyan('npm run develop')}`);
        this.log(`To run the tests, run ${chalk.cyan('npm test')}`);
        this.log(`To run the tests in a development (watching) mode, run ${chalk.cyan('npm test:watch')}`);
        this.log(`To run the compiled application run ${chalk.cyan('npm start')}`)
    }

    /**
     * Writes a template file to a destination with the "options" object as data. If "to" is omitted, from is used.
     * 
     * @param {string} from
     * @param {string} [to]
     * 
     * @memberof GiuseppePluginGenerator
     */
    _writeTemplate(from, to) {
        if (!to) {
            to = from;
        }

        this.fs.copyTpl(
            this.templatePath(from),
            this.destinationPath(to),
            this.options
        );
    }

    /**
     * Copies a file from a to b. If "to" is omitted, from is used.
     * 
     * @param {string} from
     * @param {string} [to]
     * 
     * @memberof GiuseppePluginGenerator
     */
    _copyFile(from, to) {
        if (!to) {
            to = from;
        }

        this.fs.copy(
            this.templatePath(from),
            this.destinationPath(to)
        );
    }
}

module.exports = GiuseppePluginGenerator;
