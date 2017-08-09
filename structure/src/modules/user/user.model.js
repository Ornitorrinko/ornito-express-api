const { guid } = require('../utils')
const moment = require('moment')
const persistence = require('./user.persistence')

module.exports = class User {
  async get (id) {
    await persistence.get(id)
  }

  async getBy (filter) {
    await persistence.getBy(filter)
  }

  async list (filter) {
    await persistence.list(filter)
  }

  async create (data) {
    data.id = guid()
    data.created_at = new Date()
    await persistence.insert(data)
  }
}
