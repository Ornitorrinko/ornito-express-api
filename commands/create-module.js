const loadTemplate = require('../helpers/load-template')
const createFolder = require('../helpers/create-folder')
const write = require('../helpers/write')

function createModule(name, options) {
  let database = getDatabaseConfig(options);

  let service = loadTemplate('service.js')
  let persistence = loadTemplate('persistence.js')
  let schema = loadTemplate('schema.js')
  let model = loadTemplate('model.js')
  let spectest = loadTemplate('spectest.js')
  let route = loadTemplate('route.js')

  service.locals.config = { name, title: capitalizeFirstLetter(name), database }
  persistence.locals.config = { name, title: capitalizeFirstLetter(name), database }
  schema.locals.config = { name, title: capitalizeFirstLetter(name), database }
  model.locals.config = { name, title: capitalizeFirstLetter(name) }
  spectest.locals.config = { name, title: capitalizeFirstLetter(name) }
  route.locals.config = { name, title: capitalizeFirstLetter(name) }

  const destination = `${process.cwd()}/src`;

  createFolder(`${destination}/modules/${name}`, () => {
    createFolder(`${destination}/modules/${name}/__tests__`, () => {
      write(`${destination}/modules/${name}/__tests__/${name}.spec.js`, spectest.render())
      write(`${destination}/modules/${name}/${name}.service.js`, service.render())
      write(`${destination}/modules/${name}/${name}.persistence.js`, persistence.render())
      write(`${destination}/modules/${name}/${name}.schema.js`, schema.render())
      
      if(database.isMongoDB) {
        write(`${destination}/modules/${name}/${name}.model.js`, model.render())
      }

      write(`${destination}/routes/${name}.route.js`, route.render())
      write(`${destination}/routes/admin/authenticated.${name}.route.js`, route.render())
      console.log(`   \x1b[36mcreated module ${name} files\x1b[0m`)
    })
  })
}

function getDatabaseConfig(options) {
  if (options.mongodb && options.postgres) {
    throw new Error('Choose only one database')
  }

  if (options.mongodb) {
    return {
      name: 'MongoDB',
      file: 'mongo.db',
      isMongoDB: true
    }
  }

  return {
    name: 'PostgresDB',
    file: 'postgres.db'
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = createModule;