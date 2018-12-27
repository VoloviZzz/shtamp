const path = require('path');

module.exports = (app) => {
	return ({ locals, session, dataViews } = {}) => {
		return new Promise(async (resolve, reject) => {

			const [, clients] = await app.Model.clients.get({ limit: 25, orderBy: 'id desc' });
			
			dataViews.clients = clients;

			const templatePath = path.join(__dirname, 'template.ejs');
			app.render(templatePath, dataViews, (err, str) => {
				if (err) console.log(err);
				if (err) return resolve([err, err.toString()]);


				return resolve([err, str]);
			});
		})
	}
}