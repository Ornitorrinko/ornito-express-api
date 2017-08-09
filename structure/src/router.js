const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const basePath = path.join(__dirname, '/routes')

exports.routes = _.compact(getFiles())
exports.adminRoutes = _.compact(getFiles('admin'))

function getFiles (level) {
  if (!level) level = ''
  return fs.readdirSync(`${basePath}/${level}`)
    .map((entity) => {
      let file = `${basePath}/${level}/${entity}`
      if (!isFile(file)) {
        return
      }
      return registerRoute(level, entity)
    })
}

function isFile (root) {
  try {
    return fs.statSync(root).isFile()
  } catch (err) {
    return false
  }
}

function registerRoute (level, entity) {
  let file = require(`${basePath}/${level}/${entity}`)
  let url = path.parse(entity).name
  let router = { url, router: file.default }
  return router
}
