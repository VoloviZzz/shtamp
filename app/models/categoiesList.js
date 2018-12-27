const db = require('../libs/db');

exports.add = function (data = {}) {

}

exports.getcat = function (data = {}) {
  return db.execQuery(`
	SELECT *
	FROM store_category
	`);
}

exports.getitem = function (data = {}) {
  return db.execQuery(`
	SELECT si.*, sc.title AS category_title
	FROM store_item si
  left join store_category sc

  ON si.category = sc.id
	`);
}

exports.gettag = function (data = {}) {
  return db.execQuery(`
	SELECT *
	FROM store_tags
  order by id
  DESC
	`);
}
exports.getgroup = function (data = {}) {
  return db.execQuery(`
	SELECT *
	FROM store_group_tags
  order by id
  DESC
	`);
}
