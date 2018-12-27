const Helpers = require('../libs/Helpers');

exports.getVisits = async function (req, res, next) {
	const [, visits] = await req.app.Model.visits.get({ begin: req.body.beginPeriod, end: req.body.endPeriod });
	const resArray = {};

	visits.map(v => {
		let visitDate = Helpers.formatDate(v.created, 'dd-MM-yyyy');

		if (typeof resArray[visitDate] == 'undefined') {
			resArray[visitDate] = {};
			resArray[visitDate].visits = [];
			resArray[visitDate].countViews = 0;
		}

		resArray[visitDate].visits.push(v);
		resArray[visitDate].countViews += +v.count_views;
	})

	return { status: 'ok', data: resArray }
}