exports.add = (req, res, next) => {
	const model = req.app.Model;

	if (!!req.body.text === false) return { message: 'Текст ошибки некоректен' };

	return model.reportError.add(req.body).then(([error]) => {
		if (error) return { message: error.message, error };

		return { status: 'ok' };
	})
}

exports['change_status_report'] = async function (req, res, next) {
	const Model = req.app.Model;

	if (typeof req.body.id == 'undefined') {
		return { status: 'bad', data: 'Отсутствует необходимый параметр' };
	}

	var [error, report] = await Model.reportError.get({ id: req.body.id });

	if (report.length < 1) {
		return { status: 'bad', data: 'Отчёт об ошибке не найден' };
	}

	return Model.reportError.upd({ id: req.body.id, target: 'status', value: req.body.value }).then(() => {
		return { status: 'ok', data: report };
	}).catch(error => {
		console.log(error);
		console.log(req.body);
		return { status: 'bad', data: error.toString() };
	});
};

exports['delete_report'] = async function (req, res, next) {
	const Model = req.app.Model;
	if (typeof req.body.id == 'undefined') {
		return { status: 'bad', data: 'Отсутствует необходимый параметр' };
	}

	var [error, report] = await Model.reportError.get({ id: req.body.id });

	if (report.length < 1) {
		return { status: 'bad', data: 'Отчёт об ошибке не найден' };
	}

	return Model.reportError.del({ id: req.body.id }).then(() => {
		return { status: 'ok' };
	}).catch(error => {
		console.log(error);
		console.log(req.body);
		return { status: 'bad', data: error.toString() };
	});
};


exports['delete_report_by_ids'] = function (req, res, next) {
	const Model = req.app.Model;

	if (typeof req.body.ids == 'undefined') {
		return { status: 'bad', data: 'Отсутствует необходимый параметр' };
	}

	return Model.reportError.del({ ids: req.body.ids }).then(() => {
		return { status: 'ok' };
	}).catch(error => {
		console.log(error);
		console.log(req.body);
		return { status: 'bad', data: error.toString() };
	});
};



exports['change_status_report_by_ids'] = function (req, res, next) {
	const Model = req.app.Model;
	if (typeof req.body.ids == 'undefined') {
		return { status: 'bad', data: 'Отсутствует необходимый параметр' };
	}

	return Model.reportError.upd({ ids: req.body.ids, target: 'status', value: req.body.value }).then(() => {
		return { status: 'ok' };
	}).catch(error => {
		console.log(error);
		console.log(req.body);
		return { status: 'bad', data: error.toString() };
	});
};