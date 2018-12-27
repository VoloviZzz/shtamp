const path = require('path');
const db = require('../../libs/db');

module.exports = (app) => {

    const Model = app.Model;

    return async ({ locals, session, dataViews = {} }) => {
        // logic...

        const { route, dynamicRouteNumber: targetId, URIparams } = locals;

        dataViews.route = route;
        dataViews.URIparams = URIparams;
        dataViews.targetId = targetId || '';

        return new Promise((resolve, reject) => {
            app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
                if (err) return resolve([err, err.toString()]);

                return resolve([err, str]);
            });
        })
    }
}