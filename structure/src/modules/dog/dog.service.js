const Model = require('./dog.model')
const Schema = require('./dog.schema')

const create = async (body) => {
  try {
    Schema.validate(body)
    const dog = new Model()
    const result = await dog.create(body)

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
