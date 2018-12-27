exports.get = (req, res, next) => {
	const Model = req.app.Model;

	return Model.callbacks.get(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}

exports.update = (req, res, next) => {
	const Model = req.app.Model;

	return Model.callbacks.upd(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}

exports.changeStatus = (req, res, next) => {
	const Model = req.app.Model;

	return Model.callbacks.upd(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return Model.callbacks.upd({ target: 'manager_id', value: req.session.user.id, id: req.body.id });
	}).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	});
}

exports.delete = (req, res, next) => {
	const Model = req.app.Model;

	return Model.callbacks.del(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}

exports.add = async (req, res, next) => {
	const Model = req.app.Model;
	const app = req.app;
	let agent;

	if (typeof req.body.clientNumber === 'undefined' || req.body.clientNumber == "") return { message: 'Номер телефона отсутствует' }

	const phoneRegExp = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;

	if (phoneRegExp.test(req.body.clientNumber) === false) return { message: 'Номер телефона в неправильном формате. Попробуйте снова' };

	var [error] = await Model.callbacks.add(req.body);
	if (error) return { error, message: error.message };

	if (req.body.targetId) {

		[error, [agent] = []] = await Model.agents.get({ id: req.body.targetId });

		if (agent.contact_phone) {
			await app.smsc.send({
				phones: agent.contact_phone,
				mes: 'Заказан обратный звонок: ' + req.body.clientNumber,
			});
		}
	}

	return { status: 'ok' };
}