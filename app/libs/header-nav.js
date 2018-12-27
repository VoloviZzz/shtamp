const db = require('./db');

exports.getHeaderNav = function () {
    return db.execQuery("SELECT * FROM header_nav");
};

exports.addHeaderNav = function (args) {
    const parentId = args.parentId || 0;
    return db.insertQuery(`INSERT INTO header_nav SET parent_id = '${parentId}', created = NOW()`);
}

exports.deleteHeaderNav = function ({ id }) {
    return db.execQuery(`DELETE FROM header_nav WHERE id = ${id}`);
}

exports.updateHeaderNav = function ({ id, target, value }) {
    return db.execQuery(`UPDATE header_nav SET ${target} = '${value}' WHERE id = ${id}`);
}
exports.getStoreCats = function () {
    return db.execQuery("SELECT * FROM goods_cats WHERE parent_id IS NULL");
}

exports.constructHeaderRows = async (req, res, next) => {
    var tree = false;
	await this.getHeaderNav()
		.then(([error, rows]) => {
			if (error) throw new Error(error);
			tree = unflatten(rows);
		})
		.then(() => {
			return this.getStoreCats();
		})
		.then(([error, rows]) => {
			if (error) throw new Error(error);
			
			tree.forEach((item, i) => {
				if (item.id == 4) {
					tree[i]['childs'].push({ 'type' : 'categories', rows : rows });
				}
			});
		})
		.then(() => {
			res.locals.HeaderRows = tree;
			next();
		})
}

function unflatten(arr) {
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.id] = arrElem;
        mappedArr[arrElem.id]['childs'] = [];
    }


    for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
            // If the element is not at the root level, add it to its parent array of children.
            if (mappedElem.parent_id) {
                mappedArr[mappedElem['parent_id']]['childs'].push(mappedElem);
            }
            // If the element is at the root level, add it to first level elements array.
            else {
                tree.push(mappedElem);
            }
        }
    }

    return tree;
} 