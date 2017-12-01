const path = require('path')
const fs = require('fs')
const write = require('./write')

function copyTemplate(from, to) {
    from = path.resolve('/templates/' + from)
    write(to, fs.readFileSync(from, 'utf-8'))
}

module.exports = copyTemplate;