const loadTemplate = require('../helpers/load-template')
const createFolder = require('../helpers/create-folder')
const write = require('../helpers/write')

function createModule (name) {
    let service = loadTemplate('service.js')
    let persistence = loadTemplate('persistence.js')
    let schema = loadTemplate('schema.js')
    let spectest = loadTemplate('spectest.js')
    let route = loadTemplate('route.js')
  
    service.locals.config = { name, title: capitalizeFirstLetter(name) }
    persistence.locals.config = { name, title: capitalizeFirstLetter(name) }
    schema.locals.config = { name, title: capitalizeFirstLetter(name) }
    spectest.locals.config = { name, title: capitalizeFirstLetter(name) }
    route.locals.config = { name, title: capitalizeFirstLetter(name) }
  
    const destination = `${process.cwd()}/src`;
  
    createFolder(`${destination}/modules/${name}`, () => {
      createFolder(`${destination}/modules/${name}/__tests__`, () => {
        write(`${destination}/modules/${name}/__tests__/${name}.spec.js`, spectest.render())
        write(`${destination}/modules/${name}/${name}.service.js`, service.render())
        write(`${destination}/modules/${name}/${name}.persistence.js`, persistence.render())
        write(`${destination}/modules/${name}/${name}.schema.js`, schema.render())
        write(`${destination}/routes/${name}.route.js`, route.render())
        write(`${destination}/routes/admin/authenticated.${name}.route.js`, route.render())
        console.log(`   \x1b[36mcreated module ${name} files\x1b[0m`)
      })
    })
  }

  function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  module.exports = createModule;