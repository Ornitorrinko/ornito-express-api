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
  .option('-d, --dir [dirname]', 'Which folder the project structure should be created')
  .action(start(program))

program
  .command('module [name]')
  .description('create resource with schema, service, persistence and router with the specified name and http methods')
  .option('--postgres', 'to use Postgres for this module')
  .option('--mongodb', 'to use MongoDB for this module')
  .action(createModule)

program.parse(process.argv)