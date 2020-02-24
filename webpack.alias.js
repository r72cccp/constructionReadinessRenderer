var resolve = require('path').resolve;

var alias = {
	'@constants': resolve(__dirname, './ts/constants'),
	'@entities': resolve(__dirname, './ts/entities'),
	'@lib': resolve(__dirname, './ts/lib'),
};

module.exports = alias;
