const { getSchema, validate } = require('../user.schema')

const schema = getSchema()

module.exports = {
	login (payload) {
		return validate(payload)
	},
	create (payload) {
		return validate(payload)
	},
	update (payload) {
		return validate(payload)
		// return {
		// 	payload: {
		// 		login: schema
		// 			.login
		// 			.required(),
		// 		password: schema
		// 			.password
		// 			.optional()
		// 	}
		// }
	}
}
