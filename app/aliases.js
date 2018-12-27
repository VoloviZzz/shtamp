module.exports = async app => {
	const { Model } = app;

	var [error, aliases] = await Model.aliases.get();
	if (error) {
		throw new Error(error);
	}

	const aliasesMap = aliases.reduce((store, item) => {
		const { route_id, id, alias } = item;
		store[`${route_id}-${id}`] = alias;
		return store;
	}, {});
}