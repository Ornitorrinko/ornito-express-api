import numeral from 'numeral'
import shortid from 'shortid'

export const config = require(`./config/${process.env.NODE_ENV || 'development'}.json`)

export function buildObject (fields, body) {
  return fields.reduce((obj, field) => {
    obj[field] = body[field]
    return obj
  }, {})
}

export function currency (value, currency, decimals) {
  const digitsRE = /(\d{3})(?=\d)/g
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '$'
  decimals = decimals != null ? decimals : 2
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  var i = _int.length % 3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? '.' : ''))
    : ''
  var _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  var sign = value < 0 ? '-' : ''
  _float = _float.replace('.', ',')

  return sign + currency + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}

export function formatToCurrencyBr (value) {
  numeral.language('pt-br', {
    delimiters: {
      thousands: '.',
      decimal: ','
    },
    abbreviations: {
      thousand: 'mil',
      million: 'milhões',
      billion: 'b',
      trillion: 't'
    },
    ordinal: function (number) {
      return 'º'
    },
    currency: {
      symbol: 'R$ '
    }
  })
  numeral.language('pt-br')
  var string = numeral(value).format('$0,0.00')
  return string
}

export function renameProperties (mapper, body) {
  return Object.keys(body).reduce((obj, field) => {
    let prop = mapper[field]
    obj[prop] = body[field]
    return obj
  }, {})
}

export function onlyNumbers (string) {
  var numberPattern = /\d+/g
  return string.match(numberPattern)
}

export function validate (fields, body, skip) {
  if (skip) {
    fields = fields.filter(field => {
      return skip.indexOf(field) < 0
    })
  }

  return fields.filter(field => {
    return !(body[field])
  })
}

export function validateWithDic (fieldsDic, body, skip) {
  let fields = Object.keys(fieldsDic).map(k => k)
  let report = validate(fields, body, skip)
  return report.map(r => {
    let d = fieldsDic[r].desc
    if (!d) {
      return r
    }

    return d
  })
}

export function exchangeValues (source, to) {
  for (let p of Object.keys(source)) {
    to[p] = source[p]
  }
  return to
}

export function cleaner (fields, obj) {
  return Object.keys(obj).filter((k) => {
    if (fields.indexOf(k) > -1) {
      return (obj[k])
    }
  }).reduce((o, p) => {
    o[p] = obj[p]
    return o
  }, {})
}

const bcrypt = require('bcrypt-nodejs')
const GEN_FACTOR = 10

export function hashify (value) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(GEN_FACTOR, (err, salt) => {
      if (err) {
        reject(err)
        return
      }

      bcrypt.hash(value, salt, null, (err, hash) => {
        if (err) {
          reject(err)
          return
        }

        resolve(hash)
      })
    })
  })
}

export function magnoliafy () {
  return shortid.generate()
}

export function eztravelify () {
  return shortid.generate()
}

export function compareHash (value, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(value, hash, (err, res) => {
      if (err) {
        reject(err)
        return
      }

      resolve(res)
    })
  })
}

const uuid = require('node-uuid')
export function guid () {
  return uuid.v1()
}

const CPF = require('cpf_cnpj').CPF
export function isValidCPF (value) {
  return CPF.isValid(value)
}

export function formatCPF (value) {
  return CPF.format(value)
}

const NodeRSA = require('node-rsa')
const key = new NodeRSA({
  b: 512
})
export function toBase64 (value) {
  return key.encrypt(value, 'base64')
}

const moment = require('moment')
moment.locale('pt-BR')

export function toSQLDate (value, inputFormat) {
  let sqlDateFormat = 'YYYY-MM-DD'
  return moment(value, inputFormat).format(sqlDateFormat)
}

export function toDateObject (value, inputFormat) {
  return moment(value, inputFormat)
}

export function dayMonthYear (value) {
  return moment(value).format('DD/MM/YYYY')
}

export function isDateEmpty (value) {
  return (!value) || (value === 'Invalid date')
}

export function isDate (value) {
  if (!value) {
    return false
  }

  return moment.isDate(new Date(value))
}

export function replaceAllSpacesWith (text, char) {
  return text.replace(/ /g, char)
}

export function replaceAll (target, search, replacement) {
  return target.split(search).join(replacement)
}

export function isArray (item) {
  return (Object.prototype.toString.call(item) === '[object Array]')
}

export function roundUp (value) {
  return Math.round(value * 10) / 10
}

export function toCents (number) {
  return (number || 0) * 100
}

export function stringToCents (number) {
  return parseInt(number.replace('.', ''))
}

export function maskCreditCardNumber (first, last) {
  return `${first.substr(0, 4)}********${last}`
}

export function insertCharInMiddle (value, char) {
  if (!value || !value.length) return value

  let parts = value.split('')
  parts.splice((parts.length / 2), 0, char)
  return parts.join('')
}

export function zeroIfIsNegative (n, o) {
  if (n >= o) {
    n = (n - o)
  } else if (n < o) {
    n = 0
  }

  return n
}

export function toBool (str) {
  if (typeof str !== 'string') {
    return false
  }

  return (str.toLowerCase() === 'true')
}
