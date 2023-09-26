const autoprefixer = require('autoprefixer');

const config = {
	parser: 'postcss-scss',
	plugins: [
		require('postcss-simple-vars'),
		autoprefixer,
		require('postcss-preset-env')({
			stage: 1
		})
	]
};

module.exports = config;
