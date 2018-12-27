exports['upd'] = async (req, res, next) => {
	const { Model } = req.app;
	var [error] = await Model.vacancies.upd({ target: req.body.target, value: req.body.value, id: req.body.id });
	if (error) return { status: 'bad', message: e.message };

	return { status: 'ok' };
}

exports['togglePublished'] = async (req, res, next) => {
	const { Model } = req.app;
	const { value, id } = req.body;

	var [error] = await Model.vacancies.upd({ target: 'published', value, id });
	if (error) return { status: 'bad', message: e.message };

	if (value == '1') {
		await Model.vacancies.upd({ target: 'published_time', value: new Date().toLocaleString('ru'), id });
	} else {
		await Model.vacancies.upd({ target: 'published_time', value: 'NULL', id });
	}

	return { status: 'ok' };
}

exports['del'] = (req, res, next) => {
	const { Model } = req.app;
	return Model.vacancies.del({ id: req.body.id }).then(data => {
		return { status: 'ok' };
	}).catch(e => {
		return { status: 'bad', message: e.message }
	})
}

exports['add'] = (req, res, next) => {
	const { Model } = req.app;
	return Model.vacancies.add({ creator: req.session.userId }).then(([error, resultId]) => {
		if (error) return { message: error.message, error }
		return { status: 'ok' };
	}).catch(e => {
		return { status: 'bad', message: e.message }
	})
}