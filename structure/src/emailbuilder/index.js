const pug = require('pug')
const fs = require('fs')
const moment = require('moment')
const _ = require('underscore')
const path = require('path')
const { config } = require('../utils')

export default class EmailBuilder {

  /**
    * @params
    * data: object containing information about the subject
    * destination: string -> separated by comma with emails to send
    * template: string -> name of the template to use located in emails/templates, use without .pug
    * subject: string
    */
  async sendMail (params) {
    if (!params.template) {
      throw new Error('Email template not found.')
    }
    if (!params.data) {
      throw new Error('No data provided to the templates.')
    }
    if (!params.destination) {
      throw new Error('No destination provided.')
    }
    if (!params.subject) {
      throw new Error('No subject provided.')
    }

    let fileString = fs.readFileSync(path.join(__dirname, `/templates/${params.template}.pug`), 'utf8')
    let fn = pug.compile(fileString, {})
    let html = fn({data: params.data, moment: moment})
    let _emails = params.destination.split(',')
    let _destinations = []

    _.each(_emails, (item) => {
      _destinations.push({email: item})
    })

    // send mail with defined transport object
    let sg = require('sendgrid').SendGrid(config.SENDGRID_API_KEY)
    let request = sg.emptyRequest()
    let remetente = 'naoresponda@naoresponda.com.br'
    let name = 'Nameyourprovider'
    request.body = {
      personalizations: [
        {
          to: _destinations,
          subject: SUBJECT
        }
      ],
      from: {
        email: remetente,
        name: name
      },
      content: [
        {
          type: 'text/html',
          value: html
        }
      ]
    }
    request.method = 'POST'
    request.path = '/v3/mail/send'

    const statusEmail = await sg.API(request)
    console.log('Email sent', statusEmail.statusCode)
    return statusEmail
  }
}
