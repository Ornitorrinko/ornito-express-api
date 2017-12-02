const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const mkdirp = require('mkdirp')

const MODE_0755 = parseInt('0755', 8)
const MODE_0666 = parseInt('0666', 8)

function copyTemplate(from, to) {
    from = path.join(__dirname, 'templates', from)
    write(to, fs.readFileSync(from, 'utf-8'))
}

function createFolder(dir, fn) {
    mkdirp(dir, MODE_0755, function (err) {
        if (err) throw err
        console.log('   \x1b[36mcreate\x1b[0m : ' + dir)
        fn && fn()
    })
}

function isDirectoryEmpty(dir) {
    if (!fs.existsSync(dir)) {
        return true
    }

    let files = fs.readdirSync(dir)
    return !files && !files.length
}

function loadTemplate(name) {
    var contents = fs.readFileSync(path.join( __dirname, 'templates',  `${name}.ejs`), 'utf-8')
    var locals = Object.create(null)

    function render() {
        return ejs.render(contents, locals)
    }

    return {
        locals,
        render
    }
}

function write(dir, str, mode) {
    fs.writeFileSync(dir, str, { mode: mode || MODE_0666 })
    console.log('   \x1b[36mcreate\x1b[0m : ' + dir)
}

module.exports = {
    copyTemplate,
    createFolder,
    isDirectoryEmpty,
    loadTemplate,
    write
}