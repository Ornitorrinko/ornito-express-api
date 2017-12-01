const fs = require('fs')

const MODE_0666 = parseInt('0666', 8)

function write(dir, str, mode) {
    fs.writeFileSync(dir, str, { mode: mode || MODE_0666 })
    console.log('   \x1b[36mcreate\x1b[0m : ' + dir)
}

module.exports = write;