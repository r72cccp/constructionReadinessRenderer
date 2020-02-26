var resolve = require('path').resolve;

var alias = {
	'@constants': resolve(__dirname, './src/constants'),
	'@entities': resolve(__dirname, './src/entities'),
	'@lib': resolve(__dirname, './src/lib'),
};

module.exports = alias;
