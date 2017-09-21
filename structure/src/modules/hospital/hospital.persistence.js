const database = require('../../persistence/db').knex

module.exports = {
  async insert (person) {
    return database('hospitals')
      .returning('id')
      .insert(person)
      .then(id => id[0])
      .catch(error => {
        console.error(error)
        throw new Error(`Error while inserting hospital: ${error.constraint}`)
      })
  },
  async get (filter) {
    return database('hospitals')
      .where(filter)
      .first()
      .then(result => result)
  }
}
