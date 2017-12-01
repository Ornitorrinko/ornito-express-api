#!/usr/bin/env node

const program = require('commander')
const package = require('./package.json')

const start = require('./commands/start')
const createModule = require('./commands/create-module')

program
  .version(package.version, '--version')

program
  .command('start')
  .description('init structure to start an API with Express')
  .option('-d, --dir [name]', 'Which folder the project structure should be created')
  .action(start(program))

program
  .command('module [name]')
  .description('create resource with schema, service, persistence and router with the specified name and http methods')
  .action(createModule)

program.parse(process.argv)