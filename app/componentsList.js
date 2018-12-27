module.exports = async app => {
	const db = require('./libs/db');

	var [error, componentsGroup] = await db.execQuery('SELECT * FROM `components` ORDER BY `components`.`title` ASC');
	if (error) throw new Error(error);

	app.locals.componentsObj = {};

	const componentsObj = app.locals.componentsObj;
	const generalComponents = [];

	componentsGroup.forEach(component => {
		const { block_id } = component;

		if (!!block_id === false) return generalComponents.push(component);
		if (!!componentsObj[block_id] === false) componentsObj[block_id] = [];
		componentsObj[block_id].push(component);
	})

	Object.keys(componentsObj).forEach(block_id => {
		componentsObj[block_id] = componentsObj[block_id].concat(generalComponents);
	})
}