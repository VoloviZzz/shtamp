const Model = require('../models/index');
const path = require('path');

module.exports = (app) => {
	/**
	 * ### Обработчик фрагмента
	 * Возвращает 
	 * @param {Object} fragment объект фрагмента
	 * @param {Object} data переменная, содержащая locals и session из объекта запроса
	 * @returns возвращает объект с ключами { id: fragment.id, content, fragment }, 
	 * где content - данные, которые хранит фрагмент, fragment - объект фрагмента
	 */
	const fragmentsHandler = async function (fragment, { locals, session }) {
		let errors, fragmentData = {}, content = '';

		fragment.settings = fragment.settings || {};

		locals.fragment = fragment;

		[errors, fragmentsData] = await Model.fragments.getFragmentsData({ fragment_id: fragment.id });

		if (fragmentsData.length > 0) {
			fragmentData = JSON.parse(fragmentsData[0].data);
		}
		else {
			if (fragment.component_config) {
				fragmentData.content = JSON.parse(fragment.component_config);
			}
		}

		if (!!fragment.isStatic === false) {
			Object.assign(locals, fragmentData);
			const controllerHandler = await require(path.join(AppRoot, 'components', fragment.component_ctrl))(app);
			
			// dataViews - переменная, которая передаётся в шаблоны компонентов
			// dataViews: {...locals} - копирует locals в шаблон компонентов
			[errors, content] = await controllerHandler({ locals, session, dataViews: { ...locals } });
		}
		else {
			content = fragmentData.content.body || '';
		}

		return { id: fragment.id, content, fragment };
	}

	return fragmentsHandler;
}