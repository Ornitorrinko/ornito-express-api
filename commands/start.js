const inquirer = require('inquirer')
const emptyDirectory = require('../bin/empty-directory')
const loadTemplate = require('../bin/load-template')

const questions = [
    {
        type: 'input',
        name: 'folder',
        message: 'Please inform the name of the project',
        default: 'hello-world-ornito'
    },
    {
        type: 'confirm',
        name: 'enableEsLint',
        message: 'Do you want to use ESLint?',
        default: false
    },
    {
        type: 'confirm',
        name: 'enableMongoDB',
        message: 'Do you want to use Mongodb to store anything?',
        default: true
    }
];

async function start(option) {
    const [appFolder, enableEsLint, enableMongoDb] = askQuestions()

    let appName = createAppName(appFolder)
    let isEmpty = emptyDirectory(appFolder)

    let server = loadTemplate('server.js')
    server.locals.config = config
    const origin = path.join(__dirname, '/structure/src')
    write(`${origin}/server.js`, server.render())

    if (empty || program.force) {
        createApplication(appName, destinationPath)
    }


    console.log(option.dir);
    console.log(answers);
    //main(option.dir)
}

async function askQuestions() {
    return questions.map(question => await inquirer.prompt(question)[question.name])
}

function createAppName(appFolder) {
    return path.resolve(path.basename(appFolder)
        .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase());
}

module.exports = start;