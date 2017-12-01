const fs = require('fs')
const path = require('path')

function loadTemplate(name) {
    var contents = fs.readFileSync(path.resolve(`../templates/${name}.ejs`), 'utf-8')
    var locals = Object.create(null)

    function render() {
        return ejs.render(contents, locals)
    }

    return {
        locals,
        render
    }
}

module.exports = loadTemplate