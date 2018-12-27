module.exports = (error, req, res, next) => {
	res.json({ message: error.message, error, status: 'bad' });
}