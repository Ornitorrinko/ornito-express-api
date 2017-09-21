const jwt = require('jsonwebtoken')

const SECRET_ADMIN = 'yoursecretadmin'

module.exports.verifyJWT = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  if (!token) {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    })
  }

  try {
    const decoded = jwt.verify(token, 'wrong-secret')
    req.decoded = decoded
    next()
  } catch (err) {
    console.log(err)
    return res.json({ success: false, message: 'Failed to authenticate token.' })
  }
}

module.exports.sign = (payload) => {
  const generatedToken = jwt.sign(payload, SECRET_ADMIN, {
    expiresIn: 60
    // expiresIn: '7d'
  })

  return generatedToken
}
