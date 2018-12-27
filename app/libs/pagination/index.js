const querystring = require('querystring');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

class Pagination {
	constructor({ countOnPage = 10, currentPage = 1, allCountPosts = 100, pageUrlQuery = {}, paramName = 'page' }) {

		let offset = (countOnPage) * (currentPage - 1);

		if (offset < 0) {
			offset = 0;
		}

		var countPages = allCountPosts / countOnPage;
		countPages = Number.isInteger(countPages) === false ? parseInt(countPages + 1) : countPages;

		let pagLeft = currentPage - 3;
		let pagRight = +currentPage + 3;

		if (pagLeft < 1) {
			pagRight += +Math.abs(pagLeft);
			pagLeft = 1;
		}

		if (pagRight > countPages) {
			pagRight = countPages + 1;
		}

		const pagination = {
			left: pagLeft,
			right: pagRight,
			currentPage,
			countPages,
			countOnPage,
			offset,
			paramName,
			urls: []
		}

		for (let i = pagination.left; i < pagination.right; i++) {
			let obj = { ...pageUrlQuery };
			obj[paramName] = i;

			pagination.urls.push({ page: i, url: querystring.stringify(obj) });
		}

		this.options = pagination;
	}

	render() {
		const htmlStr = fs.readFileSync(path.join(__dirname, 'pagination.ejs'), 'utf8');
		return ejs.render(htmlStr, { pagination: this.options });
	}
}

module.exports = Pagination;