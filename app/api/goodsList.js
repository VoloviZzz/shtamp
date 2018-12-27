const View = require('../View');

exports.search = async (req, res, next) => {
	const { goodsList } = req.app.Model;
	const { value } = req.body;

	if (value == '' || !!value === false) return { message: 'Введено некоректное значение' };

	const { poses, cats } = await goodsList.search({ value });

	const searchTemplate = await View.render('components/goods-list', 'search-result.ejs', { poses, cats, Helpers: req.app.locals.Helpers });

	return { status: 'ok', data: searchTemplate };
}