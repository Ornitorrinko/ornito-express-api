const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const basePath = path.join(__dirname, '/routes')

function getFiles (level) {
  if (!level) level = ''
  return fs.readdirSync(`${basePath}/${level}`)
    .map((entity) => {
      let file = `${basePath}/${level}${entity}`
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
  const routerToRequire = `${basePath}/${level}${entity}`
  // regex to find "user.route.js" and goes for "user"
  const regex = /[^.]*/
  const file = require(routerToRequire)
  const url = regex.exec(entity)[0]
  const router = { url, router: file }

  return router
}

const routes = _.compact(getFiles())
const adminRoutes = _.compact(getFiles('admin'))

module.exports = {
  routes,
  adminRoutes
}
