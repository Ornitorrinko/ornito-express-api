const Model = require('./hospital.model')
const Schema = require('./hospital.schema')

const create = async (body) => {
  try {
    Schema.validate(body)
    const hospital = new Model()
    const result = await hospital.create(body)

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
