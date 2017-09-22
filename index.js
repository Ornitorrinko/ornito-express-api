#!/usr/bin/env node

const program = require('commander')
const prompt = require('prompt')
const path = require('path')
const sortedObject = require('sorted-object')
const ncp = require('ncp').ncp
const fs = require('fs')
const mkdirp = require('mkdirp')
const inquirer = require('inquirer')
const ejs = require('ejs')

const MODE_0666 = parseInt('0666', 8)
const MODE_0755 = parseInt('0755', 8)

const _exit = process.exit
const pkg = require('./package.json')

const version = pkg.version

let WORKING_DIR = null
let DESTINATION_PATH = ''

let config = {
  useMongodb: true,
  useEslint: false,
  useIugu: false
}
ncp.limit = 16

program
  .version(version, '--version')

program
  .command('start')
  .description('init structure to start an API with Express')
  .option('-d, --dir [name]', 'Which folder the project structure should be created')
  .action(createArchitecture)

// program
//   .command('router [name]')
//   .description('create route endpoint with the specified name and http methods')
//   .option('-l, --level [name]', 'Which level this route should be created, eg: admin superadmin')
//   .action(createRoute)

program
  .command('module [name]')
  .description('create resource with model, service, persistence and router with the specified name and http methods')
  .action(createResource)

// program
//   .command('job [name]')
//   .description('create job with the specified name and http methods')
//   .action(createRoute)


program.parse(process.argv)

function createArchitecture (option) {
  main(option.dir)
}

function main (projectFolder) {
  // Path
  askForProjectFolder().then(answer => {
    let destinationPath = answer.projectFolder
    DESTINATION_PATH = destinationPath

    // App name
    let appName = createAppName(path.resolve(destinationPath))

    // Generate application
    let empty = emptyDirectory(destinationPath)

    // start asking for eslint, database and set config on server.js
    askForMongodb().then(answer => {
      config.useMongodb = answer.useMongodb
      let server = loadTemplate('server.js')
      server.locals.config = config
      const origin = path.join(__dirname, '/structure/src')
      write(`${origin}/server.js`, server.render())

      if (empty || program.force) {
        createApplication(appName, destinationPath)
      }
    })
  })
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
 
function createResource (name) {
  // copy service, model, schema, persistence to modules folder based on ejs and change the name
  let service = loadTemplate('service.js')
  let persistence = loadTemplate('persistence.js')
  let model = loadTemplate('model.js')
  let spectest = loadTemplate('spectest.js')
  let schema = loadTemplate('schema.js')
  let route = loadTemplate('route.js')

  service.locals.config = { name, title: capitalizeFirstLetter(name) }
  persistence.locals.config = { name, title: capitalizeFirstLetter(name) }
  model.locals.config = { name, title: capitalizeFirstLetter(name) }
  spectest.locals.config = { name, title: capitalizeFirstLetter(name) }
  route.locals.config = { name, title: capitalizeFirstLetter(name) }
  schema.locals.config = { name, title: capitalizeFirstLetter(name) }

  const origin = path.join(__dirname, `/structure/src/modules/${name}`)

  mkdir(origin, () => {
    mkdir(`${origin}/__tests__`, () => {
      write(`${origin}/__tests__/${name}.spec.js`, spectest.render())
      write(`${origin}/${name}.service.js`, service.render())
      write(`${origin}/${name}.persistence.js`, persistence.render())
      write(`${origin}/${name}.model.js`, model.render())
      write(`${origin}/${name}.schema.js`, model.render())

      // copy recursively the structure files to destination folder
      console.log('   destination path :', process.cwd())
      ncp(origin, `${process.cwd()}/src/modules/${name}`, (err) => {
        if (err) {
          return console.error(err)
        }

        write(`${process.cwd()}/src/routes/${name}.route.js`, route.render())
        write(`${process.cwd()}/src/routes/admin/authenticated.${name}.route.js`, route.render())

        console.log(`   \x1b[36mcreated module ${name} files\x1b[0m`)
      })
    })
  })
}

function askForProjectFolder () {
  let question = {
    type: 'input',
    name: 'projectFolder',
    message: 'Please inform the name of the project',
    default: 'hello-world-ornito'
  }
  return inquirer.prompt(question)
}

function askForEslint (fn) {
  let question = {
    type: 'confirm',
    name: 'useEslint',
    message: 'Do you want to use ESLint?',
    default: false
  }
  return inquirer.prompt(question)
}

function askForMongodb () {
  let question = {
    type: 'confirm',
    name: 'useMongodb',
    message: 'Do you want to use Mongodb to store anything?',
    default: true
  }
  return inquirer.prompt(question)
}

function createApplication (name, newPath) {
  mkdir(newPath, () => {
    // copy recursively the structure files to destination folder
    const origin = path.join(__dirname, '/structure')
    ncp(origin, newPath, (err) => {
      if (err) {
        return console.error(err)
      }
      console.log('   \x1b[36mcreated structure files\x1b[0m')

      // package.json
      const pkg = {
        name: name,
        version: '0.0.0',
        private: true,
        scripts: {
          "start": 'nodemon ./src/server.js',
          "linter": "standard './src/**/*.js' --verbose | snazzy",
          "test": "node_modules/.bin/jest --coverage --forceExit",
          "test:watch": "node_modules/.bin/jest --watch"
        },
        dependencies: {
          "bcrypt-nodejs": "0.0.3",
          "body-parser": "~1.17.1",
          "cookie-parser": "~1.4.3",
          "cors": "^2.7.1",
          "cron": "^1.1.0",
          "debug": "~2.6.3",
          "express": "4.13.3",
          "express-logger": "0.0.3",
          "express-session": "^1.14.2",
          "jsonwebtoken": "^7.4.2",
          "knex": "^0.8.6",
          "lodash": "^4.16.1",
          "moment": "^2.14.1",
          "mongoose": "^4.8.5",
          "morgan": "~1.8.1",
          "numeral": "^1.5.3",
          "ornito-route-handler": "^1.0.3",
          "randomstring": "^1.1.5",
          "serve-favicon": "~2.4.2",
          "shortid": "^2.2.6",
          "slug": "^0.9.1",
          "cpf_cnpj": "^0.2.0",
          "node-rsa": "^0.4.2",
          "uuid": "^3.1.0",
          "pg": "^7.3.0",
          "pug": "^2.0.0-rc.4",
        },
        "devDependencies": {
          "snazzy": "^7.0.0",
          "standard": "^10.0.3",
          "jest": "^21.1.0",
          "jest-cli": "^21.1.0",
        }
      }

      // sort dependencies like npm(1)
      pkg.dependencies = sortedObject(pkg.dependencies)

      // write files
      write(newPath + '/package.json', JSON.stringify(pkg, null, 2) + '\n')

      if (program.git) {
        copyTemplate('js/gitignore', newPath + '/.gitignore')
      }

      console.log()
      console.log('   install dependencies:')
      console.log('     %s cd %s && npm install', '$', newPath)
      console.log()
      console.log('   run the app:')
      console.log('     %s npm start', '$', name)
      console.log()
      console.log()
      console.log(`   \x1b[33mImportant: \x1b[0m`)
      console.log(`   \x1b[33m\x1b[1mPlease do not forget to setup your database configuration by editing ./src/config/development.json \x1b[0m`)
      console.log(`   \x1b[33m\x1b[1mHappy coding :) \x1b[0m`)
    })
  })
}

function mkdir (path, fn) {
  mkdirp(path, MODE_0755, function (err) {
    if (err) throw err
    console.log('   \x1b[36mcreate\x1b[0m : ' + path)
    fn && fn()
  })
}

/**
 * Create an app name from a directory path, fitting npm naming requirements.
 *
 * @param {String} pathName
 */

function createAppName (pathName) {
  return path.basename(pathName)
    .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
    .replace(/^[-_.]+|-+$/g, '')
    .toLowerCase()
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory (path) {
  if (!fs.existsSync(path)) {
    return true
  }
  let files = fs.readdirSync(path)
  return !files && !files.length
}

function loadTemplate (name) {
  var contents = fs.readFileSync(path.join(__dirname, 'templates', `${name}.ejs`), 'utf-8')
  var locals = Object.create(null)

  function render () {
    return ejs.render(contents, locals)
  }

  return {
    locals,
    render
  }
}

function copyTemplate (from, to) {
  from = path.join(__dirname, 'templates', from)
  write(to, fs.readFileSync(from, 'utf-8'))
}

function write (path, str, mode) {
  fs.writeFileSync(path, str, { mode: mode || MODE_0666 })
  console.log('   \x1b[36mcreate\x1b[0m : ' + path)
}
