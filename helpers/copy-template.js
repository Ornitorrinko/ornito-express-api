const path = require('path')
const fs = require('fs')
const write = require('./write')

function copyTemplate(from, to) {
    from = path.join(__dirname, '../templates', from)
    write(to, fs.readFileSync(from, 'utf-8'))
}

module.exports = copyTemplate;