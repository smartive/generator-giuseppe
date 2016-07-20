class File {
    constructor(generator, data, from, to) {
        this.data = data;
        this.from = generator.templatePath(from);
        this.to = to ? generator.destinationPath(to) : generator.destinationPath(from);
    }
}

module.exports = (generator) => {
    let files = [];

    files.push(new File(generator, {
        projectName: generator.userInput.name.split(' ').join('-').toLowerCase(),
        gitUser: generator.user.git.name(),
        gitEmail: generator.user.git.email()
    }, 'package.json'));

    return files;
};