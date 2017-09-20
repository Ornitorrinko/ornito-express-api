const User = require('./user.model')
const Schema = require('./user.schema')

const create = async (body) => {
  try {
    Schema.validate(body)
    const user = new User()
    const result = await user.create(body)

    return { id: result }
  } catch (err) {
    console.log('err', err)
    throw err
  }
}

const get = async (id) => {

}

const update = async (id, body) => {

}

module.exports = {
  create,
  get,
  update
}
