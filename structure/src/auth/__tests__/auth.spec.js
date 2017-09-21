const authorization = require('../authorization')
const faker = require('faker')

const payload = faker.internet.password()
let token = ''

const next = jest.fn()

describe('Authorization with JWT', () => {
  it('should sign a json web token that expires in 60 seconds', () => {
    const timeToExpire = '5s'
    const result = authorization.sign(payload, timeToExpire)
    token = result
    
    expect(result).toBeDefined()
  })

  it('should succesfully verify a json web token that is not expired cause we are less than 5 seconds request', () => {
    const body = { token }
    const result = authorization.verifyJWT({ body }, {}, next)
    expect(next).toHaveBeenCalled()
  })

  it('should verify a json web token after 5 seconds and receive errors cause its expired', (done) => {
    const body = { token }

    const res = {
      json: (obj) => {
        expect(obj).toHaveProperty('success', false)
        expect(obj).toHaveProperty('message', 'Failed to authenticate token.')
        expect(obj).toHaveProperty('err')
      }
    }

    // console.log('Schedule the next request in 6 seconds')
    setTimeout((callback) => {
      // console.log('6 seconds passed. Request sent.')  
      const result = authorization.verifyJWT({ body }, res, next)

      done()
    }, 6000)
    
  }, 10000)
})
