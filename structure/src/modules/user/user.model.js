const Joi = require('joi')
const { guid, hashify } = require('../../utils')
const validator = require('../../helpers/validator')

class User {
  constructor({ id, login, password }) {
    this.data = {
      login: login
    };
    this.schema = schema;

    if(id === undefined) {
      this.data.id = guid()
      this.data.password = await hashify(body.password)
    }

    this.validate()
  }

  update({ login, password }) {
    if(login) {
      this.data.login = login
    }

    if(password) {
      this.data.password = await hashify(body.password)
    }

    this.validate()

    return {
      login: this.data.login,
      password: this.data.password,
    };
  }

  validate() {
    validator
      .validate(this.data)
      .for(this.schema)
  }
}

const schema = {
  login: Joi
    .string()
    .min(1)
    .max(120)
    .trim()
    .required()
    .label('Login'),

  password: Joi
    .string()
    .min(8)
    .max(60)
    .trim()
    .regex(/(?=[\s\S]*[a-z][\s\S]*)(?=[\s\S]*[0-9][\s\S]*)/i, 'strong password')
    .required()
    .label('Senha')
};

module.exports = User
