const Joi = require('joi')

const schema = {
  id: Joi
    .number()
    .integer()
    .min(0)
    .required(),
  login: Joi
    .string()
    .min(1)
    .max(120)
    .trim()
    .required(),
  password: Joi
    .string()
    .min(8)
    .max(60)
    .trim()
    .regex(/(?=[\s\S]*[a-z][\s\S]*)(?=[\s\S]*[0-9][\s\S]*)/i, 'strong password')
    .required()
}

export function getSchema () {
  return schema
}

export function validate (body) {
	const result = Joi.validate(body, schema)
	if (result.errors) {
		throw new Error(result.errors)
	} 

	return true
}
