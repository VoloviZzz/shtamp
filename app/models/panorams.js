const db = require('../libs/db');
const fs = require('fs');

exports.setAngle = (args = {}) => {
	var zip = args.zip.split('.zip')[0];
	var xml = '';
	return fs.readFile('app/public'+zip+'/pano.xml', function (err, readXml) {
		if (err) throw err;
		xml = readXml.toString();
		var tmp_xml = xml.split('<start pan="');
		var tmp_xml2 = tmp_xml[1].split('" tilt="');
		tmp_xml2[0] = args.angle;
		xml = tmp_xml[0]+'<start pan="'+tmp_xml2[0]+'" tilt="'+tmp_xml2.splice(1).join('" tilt="');
		fs.writeFileSync('app/public'+zip+'/pano.xml', xml);
		return {status: 'ok'};
	});
}

exports.get = (args = {}) => {
	let { id } = args;
	var q = `
		SELECT * FROM panorams
	`;
	return db.execQuery(q);
}


exports.upd = (args = {}) => {
	if (!!args.target === false) return Promise.resolve([new Error('Отсутствует параметр target')]);
	if (typeof args.value === "undefined") return Promise.resolve([new Error('Отсутствует параметр value')]);
	if (!!args.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	return db.execQuery(`UPDATE history SET ${args.target} = '${args.value}' WHERE id = ${args.id}`);
}

exports.add = (args = {}) => {
	return db.insertQuery('INSERT INTO history SET title = "Новое событие", img = "/uploads/upload_3567a312aec44256a029443bfcb4e69f.gif", `desc` = "Описание нового события"');
}

exports.del = (args = {}) => {
	if (!!args.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	return db.execQuery(`DELETE FROM history WHERE id = ${args.id}`);
}
