var fs = require('fs')


function readAFile( filename ) {
    var obj = JSON.parse(fs.readFileSync( filename ).toString());
    return obj;
}

module.exports = {
    readAFile
}
