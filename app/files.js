class File {
    constructor(generator, data, from, to) {
        this.data = data;
        this.from = generator.templatePath(from);
        this.to = to ? generator.destinationPath(to) : generator.destinationPath(from);
    }
}

module.exports = (generator) => {
    let files = [];

    let projectName = generator.userInput.name.split(' ').join('-').toLowerCase();

    files.push(new File(generator, {
        projectName: projectName,
        gitUser: generator.user.git.name(),
        gitEmail: generator.user.git.email()
    }, 'package.json'));

    files.push(new File(generator, {
        projectName: projectName
    }, 'typings.json'));

    files.push(new File(generator, {
        esVersion: generator.userInput.esVersion
    }, 'tsconfig.json'));

    files.push(new File(generator, {}, 'tslint.json'));
    
    files.push(new File(generator, {needAuth: generator.userInput.needAuth}, 'app.ts'));

    if (generator.userInput.createDemoController) {
        files.push(new File(generator, {}, 'controllers/DemoController.ts'));
    }

    if (generator.userInput.needAuth) {
        let data = {
            bearer: generator.userInput.passportPlugins.indexOf('bearer') > -1,
            local: generator.userInput.passportPlugins.indexOf('local') > -1,
            basic: generator.userInput.passportPlugins.indexOf('basic') > -1
        }
        
        files.push(new File(generator, data, 'Authentication.ts'));

        if (generator.userInput.createDemoController) {
            files.push(new File(generator, data, 'controllers/AuthDemoController.ts'));
        }
    }

    if (generator.userInput.needTest && generator.userInput.createDemoController) {
        files.push(new File(generator, {}, 'controllers/DemoController.spec.ts'));
    }

    return files;
};