#!/usr/bin/env node
const program = require('commander')
const prompt = require('prompt')
const path = require('path')

const MODE_0666 = parseInt('0666', 8)
const MODE_0755 = parseInt('0755', 8)

const _exit = process.exit
const pkg = require('./package.json')

const version = pkg.version

let WORKING_DIR = null

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


program.parse(process.argv)

function createArchitecture (option) {
  console.log(option.dir)
  main(option.dir)
}
 
function createRoute (route, option) {
  
}

function main (projectFolder) {
  // Path
  var destinationPath = projectFolder || '.'

  // App name
  var appName = createAppName(path.resolve(destinationPath)) || 'hello-ornito-api'

  // Generate application
  emptyDirectory(destinationPath, (empty) => {
    if (empty || program.force) {
      createApplication(appName, destinationPath)
    }
  })
}

function createApplication (name, path) {
  var wait = 5

  console.log()
  function complete () {
    if (--wait) return
    var prompt = launchedFromCmd() ? '>' : '$'

    console.log()
    console.log('   install dependencies:')
    console.log('     %s cd %s && npm install', prompt, path)
    console.log()
    console.log('   run the app:')

    if (launchedFromCmd()) {
      console.log('     %s SET DEBUG=%s:* & npm start', prompt, name)
    } else {
      console.log('     %s DEBUG=%s:* npm start', prompt, name)
    }

    console.log()
  }

  // JavaScript
  var app = loadTemplate('js/app.js')
  var www = loadTemplate('js/www')

  // App name
  www.locals.name = name

  // App modules
  app.locals.modules = Object.create(null)
  app.locals.uses = []

  mkdir(path, function () {

    mkdir(path + '/routes', function () {
      copyTemplate('js/routes/index.js', path + '/routes/index.js')
      copyTemplate('js/routes/users.js', path + '/routes/users.js')
      complete()
    })

    // package.json
    var pkg = {
      name: name,
      version: '0.0.0',
      private: true,
      scripts: {
        start: 'node ./src/server.js'
      },
      dependencies: {
        'body-parser': '~1.17.1',
        'cookie-parser': '~1.4.3',
        'debug': '~2.6.3',
        'express': '~4.15.2',
        'morgan': '~1.8.1',
        'serve-favicon': '~2.4.2'
      }
    }

    // sort dependencies like npm(1)
    pkg.dependencies = sortedObject(pkg.dependencies)

    // write files
    write(path + '/package.json', JSON.stringify(pkg, null, 2) + '\n')
    write(path + '/app.js', app.render())
    mkdir(path + '/bin', function () {
      write(path + '/bin/www', www.render(), MODE_0755)
      complete()
    })

    if (program.git) {
      copyTemplate('js/gitignore', path + '/.gitignore')
    }

    complete()
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

function emptyDirectory (path, fn) {
  fs.readdir(path, function (err, files) {
    if (err && err.code !== 'ENOENT') throw err
    fn(!files || !files.length)
  })
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
