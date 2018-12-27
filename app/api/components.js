var fs = require("fs");
const db = require('../libs/db');

exports.addComponent = (req, res, next) => {

	const Model = req.app.Model;

	fs.mkdir('app/components/' + req.body.component, function () {


		var data = `
<link rel="stylesheet" href="/css/`+req.body.component+`.css">
<h1>`+req.body.title+`</h1>
<script src="/js/`+req.body.component+`.js" defer></script>
<% if(user.adminMode) { %>
	<script src="/admins/js/`+req.body.component+`.js" defer></script>
<% } %>
		`;
		fs.writeFile('app/components/'+req.body.component+'/template.ejs', data);
		fs.writeFile('app/public/js/'+req.body.component+'.js', '');
		fs.writeFile('app/public/admins/js/'+req.body.component+'.js', '');
	  fs.writeFile('app/public/css/'+req.body.component+'.css', '');
		 var data2 = `
const path = require('path');
module.exports = (app) => {
	const Model = app.Model;
	return async ({ locals, session, dataViews = {} }) => {
		dataViews.user = session.user;
		return new Promise((resolve, reject) => {
			const template = app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);
				return resolve([err, str]);
			});
		})
	}
}
		 `;

		fs.writeFile('app/components/' + req.body.component + '/index.js', data2);
	});

	return Model.components.add(req.body).then(([error, rows]) => {
		if (error) return { message: error.message, error };
		return { status: 'ok' }
	})
}

exports.delComponents = (req, res, next) => {

	const Model = req.app.Model;

	JSON.parse(req.body.ids).forEach(elem => {
		db.execQuery(`SELECT * FROM components where id=`+elem).then(([error, row]) => {
			if (error) return { message: error.message, error };
			console.log(row);
			var component = row[0];
			fs.unlinkSync('app/components/'+component.ctrl+'/template.ejs');
			fs.unlinkSync('app/components/'+component.ctrl+'/index.js');
			fs.rmdirSync('app/components/' + component.ctrl);
			fs.unlinkSync('app/public/js/'+component.ctrl+'.js');
			fs.unlinkSync('app/public/admins/js/'+component.ctrl+'.js');
		  fs.unlinkSync('app/public/css/'+component.ctrl+'.css');
			db.execQuery(`DELETE FROM components where id=`+component.id);
		});
	});
	return {status: 'ok'}

}

exports.delComponent = (req, res, next) => {

	const Model = req.app.Model;

		return db.execQuery(`SELECT * FROM components where id=`+req.body.id).then(([error, row]) => {
			if (error) return { message: error.message, error };
			console.log(row);
			var component = row[0];
			fs.unlinkSync('app/components/'+component.ctrl+'/template.ejs');
			fs.unlinkSync('app/components/'+component.ctrl+'/index.js');
			fs.rmdirSync('app/components/' + component.ctrl);
			fs.unlinkSync('app/public/js/'+component.ctrl+'.js');
			fs.unlinkSync('app/public/admins/js/'+component.ctrl+'.js');
		  fs.unlinkSync('app/public/css/'+component.ctrl+'.css');
			db.execQuery(`DELETE FROM components where id=`+component.id);
		}).then((val)=>{
			return {status: 'ok'}
		});



}











//---------------------------
