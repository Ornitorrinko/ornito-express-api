#!/usr/bin/env node
const program = require('commander')
const prompt = require('prompt')
const path = require('path')
const sortedObject = require('sorted-object')
const ncp = require('ncp').ncp
const fs = require('fs')
const mkdirp = require('mkdirp')

const MODE_0666 = parseInt('0666', 8)
const MODE_0755 = parseInt('0755', 8)

const _exit = process.exit
const pkg = require('./package.json')

const version = pkg.version

let WORKING_DIR = null

ncp.limit = 16

program
  .version(version, '--version')

program
  .command('start')
  .description('init structure to start an API with Express')
  .option('-d, --dir [name]', 'Which folder the project structure should be created')
  .action(createArchitecture)

program
  .command('router [name]')
  .description('create route endpoint with the specified name and http methods')
  .option('-l, --level [name]', 'Which level this route should be created, eg: admin superadmin')
  .action(createRoute)

program
  .command('service [name]')
  .description('create service with the specified name')
  .action(createRoute)

program
  .command('model [name]')
  .description('create model with the specified name')
  .action(createRoute)

program
  .command('persistence [name]')
  .description('create persistence file with the specified name')
  .action(createRoute)

program
  .command('job [name]')
  .description('create job with the specified name and http methods')
  .action(createRoute)


program.parse(process.argv)

function createArchitecture (option) {
  main(option.dir)
}
 
function createRoute (route, option) {
  
}

function main (projectFolder) {
  // Path
  let destinationPath = projectFolder || '.'

  // App name
  let appName = createAppName(path.resolve(destinationPath)) || 'hello-ornito-api'

  // Generate application
  let empty = emptyDirectory(destinationPath)

  if (empty || program.force) {
    createApplication(appName, destinationPath)
  }
}

function createApplication (name, newPath) {
  mkdir(newPath, () => {
    // copy recursively the template files to destination folder
    const origin = path.join(__dirname, '/templates')
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
          start: 'node ./src/server.js',
          test: 'node ./test/server.js'
        },
        dependencies: {
          "body-parser": "~1.17.1",
          "cookie-parser": "~1.4.3",
          "debug": "~2.6.3",
          "express": "~4.15.2",
          "morgan": "~1.8.1",
          "serve-favicon": "~2.4.2",
          "cors": "^2.7.1",
          "cron": "^1.1.0",
          "express": "4.13.3",
          "express-logger": "0.0.3",
          "express-session": "^1.14.2",
          "knex": "^0.8.6",
          "lodash": "^4.16.1",
          "moment": "^2.14.1",
          "mongoose": "^4.8.5",
          "shortid": "^2.2.6",
          "slug": "^0.9.1",
          "bcrypt-nodejs": "0.0.3",
          "numeral": "^1.5.3",
          "randomstring": "^1.1.5",
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
      console.log('     %s DEBUG=%s npm start', '$', name)
      console.log()
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
  var contents = fs.readFileSync(path.join(__dirname, '..', 'templates', (name + '.pug')), 'utf-8')
  var locals = Object.create(null)

  function render () {
    return ejs.render(contents, locals)
  }

  return {
    locals: locals,
    render: render
  }
}

function copyTemplate (from, to) {
  from = path.join(__dirname, '..', 'templates', from)
  write(to, fs.readFileSync(from, 'utf-8'))
}

function write (path, str, mode) {
  fs.writeFileSync(path, str, { mode: mode || MODE_0666 })
  console.log('   \x1b[36mcreate\x1b[0m : ' + path)
}
