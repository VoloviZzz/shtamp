const Model = require('./models');

module.exports = async app => {

	var [error, configs] = await Model.siteConfig.get();
	var configs = configs;

	app.siteConfig = app.locals.siteConfig = {
		configs,
		get(target) {
			const configItem = this.configs.find(configItem => configItem.target === target);
			return !!configItem ? configItem.value : '';
		},

		async refresh() {
			var [error, configs] = await Model.siteConfig.get();
			this.configs = configs;
			return configs;
		},

		async set({ target, value, title = '' }) {
			const configItemIndex = this.configs.findIndex(configItem => configItem.target === target);

			if (configItemIndex < 0) {
				await Model.siteConfig.add({ title, target, value })
				this.configs.push({ target, value });

				return this;
			}

			await Model.siteConfig.setValue({ target, value });

			Object.assign(this.configs[configItemIndex], { target, value });
		}
	}
}