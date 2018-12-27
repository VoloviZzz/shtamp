const Model = require('./models');

module.exports = async app => {

	const [error, socialLinks] = await Model.socialLinks.get();

	app.socialLinks = app.locals.socialLinks = {
		socialLinks,

		get() {
			return this.socialLinks;
		},

		async add({ title = '', href = '', icon = 'fa-question' }) {
			return Model.socialLinks.add().then(async ([error, linkid]) => {
				[, this.socialLinks] = await Model.socialLinks.get();
			})
		},

		async upd({ id, target, value }) {
			return Model.socialLinks.upd({ id, target, value }).then(async ([error, linkid]) => {
				[, this.socialLinks] = await Model.socialLinks.get();
			})
		},

		async del({ id }) {
			return Model.socialLinks.del({ id }).then(async ([error, linkid]) => {
				[, this.socialLinks] = await Model.socialLinks.get();
			})
		}
	};

	app.post('/api/socialLinks/add', async (req, res, next) => {
		await app.socialLinks.add({});
		return res.send({ status: 'ok' });
	});

	app.post('/api/socialLinks/upd', async (req, res, next) => {
		await app.socialLinks.upd(req.body);
		return res.send({ status: 'ok' });
	});

	app.post('/api/socialLinks/del', async (req, res, next) => {
		await app.socialLinks.del(req.body);
		return res.send({ status: 'ok' });
	});
}
