module.exports = (req, res, next) => {
	console.log(new Date().toLocaleTimeString(), `Пришёл запрос на адрес: ${req.url}`);
	next();
}