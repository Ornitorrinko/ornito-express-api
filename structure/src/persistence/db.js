const { config } = require('../utils')

console.log(config.db_host)

const knex = require('knex')({
  client: 'pg',
  connection: config.db_host,
  pool: {
    min: 2,
    max: 10
  }
})

module.exports = {
  knex
}
