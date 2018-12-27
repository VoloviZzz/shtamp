const path = require('path');
const Model = require('../../models');
const db = require('../../libs/db');

module.exports = (app) => {

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const getQuestionsParams = {
			type: 'question'
		};

		const questionsTarget = {
			target: locals.fragment.settings.target || '0'
		};

		var [error, cats] = await db.execQuery(`SELECT * FROM questions_categories WHERE target_id = '${questionsTarget.target}'`);
		if (error) {
			console.log(error);
			return Promise.resolve([null, error.message]);
		}

		var [error, questions] = await Model.questions.get({ ...getQuestionsParams, ...questionsTarget, public: '1' });
		if (error) {
			console.log(error);
			return Promise.resolve([null, error.message]);
		}

		var [error, questionsNotPublished] = await Model.questions.get({ ...getQuestionsParams, ...questionsTarget, public: '0' });
		if (error) {
			console.log(error);
			return Promise.resolve([null, error.message]);
		}

		var [error, questionsTargets] = await Model.questions.getTargets();

		const catsObject = cats.reduce((prev, current) => {
			current.questions = [];
			prev[current.id] = current;
			return prev;
		}, {});

		const questionsNoCategory = questions.filter((question) => {
			if (catsObject[question.category_id]) {
				catsObject[question.category_id].questions.push(question);
				return false;
			} else {
				return true;
			}
		});

		catsObject['Без категории'] = { title: 'Без категории', questions: questionsNoCategory };

		dataViews.cats = Object.values(catsObject);
		dataViews.catsArray = cats;
		dataViews.questions = questions || [];
		dataViews.questionsNotPublished = questionsNotPublished || [];
		dataViews.fragment = locals.fragment;
		dataViews.targets = questionsTargets;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}