const fs = require('fs');
const express = require('express');
const Router = express.Router();
const path = require('path');

const db = require('./libs/db');
const Model = require('./models');

const checkAdminMiddleware = (req, res, next) => {
	if (req.session.user.admin) {
		return next();
	} else {
		return next(new Error('Нет доступа'));
	}
}

const clearSessionData = (req, res, next) => {
	req.session.user = null;
	res.redirect(req.header('Referer') || '/');
}

const toggleAdminMode = (req, res, next) => {
	if (!!req.session.user.admin === false) return res.json({
		status: 'bad',
		message: `Нет доступа к данной функции`
	});

	req.session.user.adminMode = !req.session.user.adminMode;
	res.json({ status: 'ok' });
}

Router.get('/robots.txt', async (req, res, next) => {
	const resultValue = `<pre style="word-wrap: break-word; white-space: pre-wrap;">${app.siteConfig.get('robotsValue')}</pre>`.trim();

	return res.send(resultValue);
});

Router.get('/sitemap.xml', async (req, res, next) => {
	try {

		const siteName = 'http://localhost:3000';
		const xmlUrls = [];

		const setRowAliasUrlIfExist = row => {
			if (!row.alias_id) return row;

			row.alias_url = aliasesById[row.alias_id].alias;

			return row;
		}

		const groupByParam = param => {
			return (acc, object) => {
				acc[object[param]] = object;
				return acc;
			};
		}

		const addRowByTarget = (row, route) => {
			return row.target ? (route.object_target_id == row.target ? row : false) : row;
		};

		const addRowByPublic = row => {
			return 'public' in row ? (row.public == '1' ? row : false) : row;
		};

		const pushUrlInUrls = (row, urlToOBject) => {
			xmlUrls.push(`
				<url>
					<loc>${siteName}${row.alias_url ? row.alias_url : urlToOBject + '/' + row.id}</loc>
				</url>
			`);
		};

		const [, routes] = await Model.routes.get({ dynamic: '0', access: '1', allow_index: '1' });
		const [, aliases] = await Model.aliases.get();

		const groupById = groupByParam('id');
		const aliasesById = aliases.reduce(groupById, {});

		for (const route of routes) {

			const { url, url_to_object: urlToOBject } = route;

			xmlUrls.push(`
				<url>
					<loc>${siteName}${url}</loc>
				</url>
			`);

			if (!route.used_table) continue;

			const [error, allRows] = await db.execQuery(`SELECT * FROM ${route.used_table}`);
			if (error) throw new Error(error);

			const result = allRows
				.filter(row => addRowByTarget(row, route))
				.filter(row => addRowByPublic(row))
				.map(row => setRowAliasUrlIfExist(row));

			result.forEach(row => pushUrlInUrls(row, urlToOBject));
		}

		const urlsJoined = xmlUrls.join('');

		const xmlTemplate = `
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				${urlsJoined}
			</urlset>
		`;

		res.set('Content-Type', 'text/xml');
		res.send(xmlTemplate);
	} catch (error) {
		console.log(error);
		res.status('500').send('Что-то пошло не так: \n' + error.message);
	}
});

Router.post('/toggle-admin', toggleAdminMode);
Router.get('/logout', clearSessionData);

Router.get('/admin-login', (req, res, next) => {
	res.render('admin-login');
});

Router.get('/admin-logs', checkAdminMiddleware, (req, res, next) => {
	fs.readdir(path.join(__dirname, 'logs'), (error, files) => {
		if (error) {
			return res.send(error);
		}

		res.render('admin-logs', {
			files: files
		});
	})
});

Router.get('/admin-patches', checkAdminMiddleware, (req, res, next) => {
	const files = fs.readdirSync(`${AppRoot}/enginePatches`);
	res.render(`admin-patches`, { files });
});

Router.get('/admin-patches/:patch', checkAdminMiddleware, async (req, res, next) => {
	const controller = require(`${AppRoot}/enginePatches/${req.params.patch}`);
	await controller();
	res.send(`ok`);
});

Router.get('/admin-logs/:logName', checkAdminMiddleware, (req, res, next) => {
	fs.readFile(path.join(__dirname, 'logs', req.params.logName), 'utf8', (error, data) => {
		if (error) {
			return res.send(error);
		}

		res.sendFile(path.join(__dirname, 'logs', req.params.logName));
	})
});

Router.get('/confirm-email', async (req, res, next) => {

	try {
		if (!req.query.t) {
			return res.json({ status: 'bad' });
		}

		var [error, [confirmedEmailsByHash] = [false]] = await Model.confirmEmails.get({ hash: req.query.t });

		if (!!confirmedEmailsByHash === false) {
			return Promise.reject({ status: 'bad', message: 'Неправильный hash' });
		}

		if (confirmedEmailsByHash.checked == '1') {
			return Promise.reject({
				status: 'bad',
				message: 'Почта уже подтвеждена'
			});
		}

		const clientId = confirmedEmailsByHash.client_id;

		await Model.confirmEmails.upd({
			target: 'checked',
			value: '1',
			id: confirmedEmailsByHash.id
		})

		await Model.clients.upd({
			id: clientId,
			target: 'confirmed',
			value: '1'
		})

		return res.redirect('/login');
	} catch (error) {
		console.error(error);
		return res.json(error);
	}
})


module.exports = Router;