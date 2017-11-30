const User = require('./user.model')
const persistence = require('./user.persistence')

const list = async (filter) => {
  return await persistence.list(filter || {})
}

const getById = async (id) => {
  return await persistence.get({ id: id })
}

const create = async (body) => {
  const user = new User(body)
  const id = await persistence.insert(user.data)
  return id;
}

const update = async (id, body) => {
  const found = await getById(id);
  
  if(!found)
    throw new Error('Não encontrado.')

  const user = new User(found);
  const data = user.update(body);
  await persistence.update(id, data);
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
