const db = require('../libs/db');
const Model = require('../models');

exports.createTarget = (req, res, next) => {
	const Model = req.app.Model;

	if (!!req.body.title === false && req.body.title !== '') {
		return { message: 'Отсутствует title' };
	}

	return db.insertQuery(`INSERT INTO questions_targets SET title = '${req.body.title}'`).then(([error, targetId]) => {
		if (error) {
			console.log(error);
			return { message: error.message, error };
		}

		return { status: 'ok', targetId };
	})
}

exports.delQuestion = (req, res, next) => {
	const Model = req.app.Model;

	return Model.questions.del({ id: req.body.id }).then(result => {
		return { status: 'ok' }
	}).catch(e => {
		console.error(e);
		return { status: 'bad', message: e.message }
	})
}

exports.addQuestion = (req, res, next) => {
	const Model = req.app.Model;

	return Model.questions.add({ question: req.body.question, target: req.body.target }).then(result => {
		return { status: 'ok' }
	}).catch(error => {
		console.log(error);
		return { message: error.toString(), error };
	});

}

exports.changeCategory = (req, res, next) => {
	const Model = req.app.Model;
	if (typeof req.body.id == 'undefined') {
		return { status: 'bad', message: 'change_category: Не указан id' }
	}

	return Model.questions.upd({ target: 'category_id', value: req.body.value, id: req.body.id }).then(result => {
		return { status: 'ok' };
	}).catch(error => {
		return { status: 'bad', message: 'error' };
	})
}

exports.editQuestion = (req, res, next) => {
	const Model = req.app.Model;
	
	if (typeof req.body.id == 'undefined') {
		return { status: 'bad', message: 'editQuestion: Не указан id' }
	}

	return Model.questions.upd({ target: 'question', value: req.body.value, id: req.body.id }).then(result => {
		return { status: 'ok' };
	}).catch(error => {
		return { status: 'bad', message: 'error' };
	})

}

exports.editAnswer = (req, res, next) => {
	const Model = req.app.Model;
	if (typeof req.body.id == 'undefined') {
		return { status: 'bad', message: 'edit_answer: Не указан id' }
	}

	return Model.questions.upd({ target: 'answer', value: req.body.value, id: req.body.id }).then(result => {
		return { status: 'ok' };
	}).catch(error => {
		return { status: 'bad', message: 'error' };
	})

}

exports.togglePublication = async (req, res, next) => {
	const Model = req.app.Model;
	if (typeof req.body.id == 'undefined') {
		return { status: 'bad', message: 'toggle_publication: Не указан id' }
	}

	const [, questions] = await Model.questions.get({ id: req.body.id });
	const question = questions[0];

	if (!!question.answer === false) {
		return { status: 'bad', message: 'Нельзя опубликовать вопрос без текста ответа' }
	}

	return Model.questions.upd({ target: 'public', value: req.body.value, id: req.body.id }).then(result => {
		return { status: 'ok' };
	}).catch(error => {
		return { status: 'bad', message: 'error' };
	})

}

exports.changeCategory = (req, res, next) => {
	const { Model } = req.app;

	return Model.questions.upd({ target: 'category_id', value: req.body.value, id: req.body.id }).then(result => {
		return { status: 'ok' };
	}).catch(error => {
		return { status: 'bad', message: 'error' };
	})
}

exports.addCategory = async (req, res, next) => {
	var [error] = await Model.questions.addCategory(req.body);
	if (error) {
		return { status: 'bad', message: error.message };
	}

	return { status: 'ok' };
}

exports.deleteCategory = async (req, res, next) => {
	var [error] = await Model.questions.deleteCategory(req.body);
	if (error) {
		return { status: 'bad', message: error.message };
	}

	return { status: 'ok' };
}