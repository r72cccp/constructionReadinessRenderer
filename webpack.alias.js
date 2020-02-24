var resolve = require('path').resolve;

var alias = {
	'@constants': resolve(__dirname, './ts/constants'),
	'@lib': resolve(__dirname, './ts/lib'),
};

module.exports = alias;
