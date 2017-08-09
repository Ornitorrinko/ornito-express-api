const database = require('./db')

module.exports = {
  insert(person) {
    return database().knex('users')
      .returning('id')
      .insert(person)
      .then(id => id)
      .catch(error => {
        console.error(error)
        throw new Error('Error while inserting user')
      })
  },
  get(filter) {
    return database().knex('users')
      .where(filter)
      .first()
      .then(result => result)
  }
}
