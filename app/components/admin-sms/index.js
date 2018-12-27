const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const result = await Promise.all([
			Model.siteConfig.get({ target: 'smsAuthLogin' }),
			Model.siteConfig.get({ target: 'smsAuthPassword' }),
			Model.siteConfig.get({ target: 'smsAuthHashed' }),
			Model.siteConfig.get({ target: 'smsTemplatePhoneConfirm' }),
			Model.siteConfig.get({ target: 'smsTemplateOrderComplete' }),
		]);

		var [error, [smsAuthLogin = { value: '' }]] = result[0];
		var [error, [smsAuthPassword = { value: '' }]] = result[1];
		var [error, [smsAuthHashed = { value: '' }]] = result[2];
		var [error, [smsTemplatePhoneConfirm = { value: '' }]] = result[3];
		var [error, [smsTemplateOrderComplete = { value: '' }]] = result[4];

		if (error) return [, error.message];

		dataViews.smsAuthLogin = smsAuthLogin.value;
		dataViews.smsAuthPassword = smsAuthPassword.value;
		dataViews.smsTemplateOrderComplete = smsTemplateOrderComplete.value;
		dataViews.smsTemplatePhoneConfirm = smsTemplatePhoneConfirm.value;
		dataViews.smsAuthHashed = smsAuthHashed.value == 'true' ? 1 : 0;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}