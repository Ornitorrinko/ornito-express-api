const mkdirp = require('mkdirp')

const MODE_0755 = parseInt('0755', 8)

function createFolder(dir, fn) {
    mkdirp(dir, MODE_0755, function (err) {
        if (err) throw err
        console.log('   \x1b[36mcreate\x1b[0m : ' + dir)
        fn && fn()
    })
}

module.exports = createFolder