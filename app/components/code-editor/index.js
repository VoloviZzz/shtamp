const path = require('path');
const fs = require('fs');

module.exports = (app) => {
	const Model = app.Model;
	return async ({ locals, session, dataViews = {} }) => {

		dataViews.template = '---';
		dataViews.routeId = locals.dynamicRouteNumber;
		var [error, component] = await Model.components.get({
			id: locals.dynamicRouteNumber
		});
		dataViews.component = component[0];
		dataViews.filesComponents = fs.readdirSync('app/components/'+ dataViews.component.ctrl +'', (err, files) => {return files});
		dataViews.api = fs.readdirSync('app/api/', (err, files) => {return files});
		dataViews.models = fs.readdirSync('app/models/', (err, files) => {return files});
		dataViews.adminsJS = fs.readdirSync('app/public/admins/js/', (err, files) => {return files});
		dataViews.adminsCSS = fs.readdirSync('app/public/admins/css/', (err, files) => {return files});
		dataViews.publicJS = fs.readdirSync('app/public/js/', (err, files) => {return files});
		dataViews.publicCSS = fs.readdirSync('app/public/css/', (err, files) => {return files});
		dataViews.index = fs.readFileSync('app/components/'+ dataViews.component.ctrl +'/index.js').toString();
		dataViews.template = fs.readFileSync('app/components/'+ dataViews.component.ctrl +'/template.ejs').toString();
		dataViews.user = session.user;

		return new Promise((resolve, reject) => {
			const template = app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);
				return resolve([err, str]);
			});
		})
	}
}
