const database = require('../../persistence/db').knex

module.exports = {
  async insert (person) {
    return database('users')
      .returning('id')
      .insert(person)
      .then(id => id[0])
      .catch(error => {
        console.error(error)
        throw new Error(`Error while inserting user: ${error.constraint}`)
      })
  },
  async get (filter) {
    return database('users')
      .where(filter)
      .first()
      .then(result => result)
  }
}
