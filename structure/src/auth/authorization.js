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
    const decoded = jwt.verify(token, SECRET_ADMIN)
    req.decoded = decoded
    next()
  } catch (err) {
    // console.log(err)
    return res.json({ success: false, message: 'Failed to authenticate token.', err })
  }
}

module.exports.sign = (payload, time = '7d') => {
  const generatedToken = jwt.sign({ data: payload }, SECRET_ADMIN, { expiresIn: time })

  return generatedToken
}
