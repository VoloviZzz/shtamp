const Model = require('../models/index');

const db = require('../libs/db');

exports.initRoutes = initRoutes = async () => {

    const routesObj = {};

    let [queryError, routes] = await Model.routes.get();
    if (queryError) throw new Error(queryError)

    let routesUrls = [];

    routes.map(function (r) {
        routesUrls.push(r.url);

        return routesObj[r.url] = r;
    })

    return [null, routesObj];
}