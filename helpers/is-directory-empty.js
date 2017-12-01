const fs = require('fs')

function isDirectoryEmpty(dir) {
    if (!fs.existsSync(dir)) {
        return true
    }

    let files = fs.readdirSync(dir)
    return !files && !files.length
}

module.exports = isDirectoryEmpty