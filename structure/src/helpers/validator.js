const Joi = require('joi')

module.exports = {
    validate(data) {
        return {
            for(shema) {
                const result = Joi.validate(data, schema)

                if (result.error || result.errors) {
                    throw new Error(result.error || result.errors)
                }

                return true
            }
        };
    }
}