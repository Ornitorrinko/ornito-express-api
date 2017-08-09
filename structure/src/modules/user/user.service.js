const Validator = require('./user.validation')
const User = require('./user.model')

exports.create = async (body) => {
	try {
		Validator.create(body)
		const user = await User.create(body)
		return user
	} catch (err) {
		throw err
	}
}

exports.get = async (id) => {

}

exports.update = async (id, body) => {
  
}
