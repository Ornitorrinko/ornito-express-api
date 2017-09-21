const database = require('../../persistence/db').knex

module.exports = {
  async insert (payload) {
    return database('dogs')
      .returning('id')
      .insert(payload)
      .then(id => id[0])
      .catch(error => {
        console.error(error)
        throw new Error(`Error while inserting dog: ${error} ${error.constraint ? error.constraint : ''} `)
      })
  },
  async get (filter) {
    return database('dogs')
      .where(filter)
      .first()
      .then(result => result)
  }
}
