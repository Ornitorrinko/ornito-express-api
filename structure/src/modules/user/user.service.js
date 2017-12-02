const validator = require('../../helpers/validator')
const { guid, hashify } = require('../../utils')
const schema = require('./user.schema')
const persistence = require('./user.persistence')

const list = async (filter) => {
  return await persistence.list(filter || {})
}

const getById = async (id) => {
  return await persistence.get({ id: id })
}

const create = async ({ login, password }) => {
  const user = {
    id: guid(),
    login: login,
    password: hashify(password)
  }

  validator
    .validate(user)
    .for(schema);

  return await persistence.insert(user)
}

const update = async (id, { login, password }) => {
  const exits = await getById(id)
  
  if(!exits)
    throw new Error('Não encontrado.')

  let user = {
    login: login
  }

  if(password) {
    user.password = hashify(password)
  }

  validator
    .validate(user)
    .for(schema)

  await persistence.update(id, user)
}

const remove = async (id) => {
  await persistence.remove(id)
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
}
