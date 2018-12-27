const ejs = require('ejs');
const path = require('path');

module.exports = {
	render(folderName, fileName, data = {}) {
		return new Promise((resolve, reject) => {
			ejs.renderFile(path.join(__dirname, folderName, fileName), data, (error, string) => {
				if(error) return resolve(error.toString());

				return resolve(string);
			});
		})
	}
};