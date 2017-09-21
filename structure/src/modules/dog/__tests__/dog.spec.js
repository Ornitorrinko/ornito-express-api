const Service = require('../dog.service')
const faker = require('faker')

describe('#create() dog', () => {
  it('should add dog with login and strong password', async () => {
    const payload = { }
    const result = await Service.create(payload)
    expect(result).toHaveProperty('id')
  })
})
