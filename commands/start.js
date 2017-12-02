const path = require('path')
const inquirer = require('inquirer')
const copyRecursively = require('ncp').ncp
const { isDirectoryEmpty, loadTemplate, createFolder, copyTemplate, write } = require('../helpers')

copyRecursively.limit = 16

const questions = [
    {
        type: 'input',
        name: 'appFolder',
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

async function start(program, options) {
    const answers = options.dir ? [options.dir] : []
    const [appFolder, enableEsLint, enableMongoDB] = await askQuestions(answers)

    let appName = createAppName(appFolder)
    let isEmpty = isDirectoryEmpty(appFolder)

    let config = {
        appName,
        appFolder,
        enableEsLint,
        enableMongoDB,
        git: program.git
    }

    if (!isEmpty) {
        console.error('Sorry, destination directory is not empty.')
        return;
    }

    copyFilesFromStructure(config);
}

async function askQuestions(answers) {
    answers = answers || []

    for (let i = 0; i < questions.length; i++) {
        let question = questions[i]

        if (!answers[i]) {
            let answer = await inquirer.prompt(question)
            answers.push(answer[question.name])
        }
    }

    return answers
}

function createAppName(appFolder) {
    return path.basename(path.resolve(appFolder))
        .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase();
}

function copyFilesFromStructure(config) {
    createFolder(config.appFolder, () => {
        const origin = path.resolve('./structure')

        copyRecursively(origin, config.appFolder, (err) => {
            if (err) {
                return console.error(err)
            }

            copyServer(config)
            copyPackageJson(config)

            console.log('   \x1b[36mcreated structure files\x1b[0m')

            if (config.git) { // ?
                copyTemplate('js/gitignore', config.appFolder + '/.gitignore')
            }

            showSuccessMessage(config)
        })
    })
}

function copyServer(config) {
    let template = loadTemplate('server.js')
    template.locals.config = config
    write(`${config.appFolder}/src/server.js`, template.render())
}

function copyPackageJson(config) {
    let template = loadTemplate('package.json')
    template.locals.config = config
    write(`${config.appFolder}/package.json`, template.render())
}

function showSuccessMessage(config) {
    console.log()
    console.log('   install dependencies:')
    console.log('     %s cd %s && npm install', '$', config.appFolder)
    console.log()
    console.log('   run the app:')
    console.log('     %s npm start', '$')
    console.log()
    console.log()
    console.log(`   \x1b[33mImportant: \x1b[0m`)
    console.log(`   \x1b[33m\x1b[1mPlease do not forget to setup your database configuration by editing ./src/config/development.json \x1b[0m`)
    console.log(`   \x1b[33m\x1b[1mHappy coding :) \x1b[0m`)
}

module.exports = (program) => (options) => start(program, options);