const express = require('express');
const app = express();

const path = require('path');
const ejs = require('ejs');
const cookieSession = require('cookie-session');
const fs = require('fs');
const compression = require('compression');


const config = require('../config');
const db = require('./libs/db');
const Model = require('./models/index');

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
	limit: '2048mb',
	extended: false
}));

app.use(cookieSession(config.session));

const ShoppingCart = require('./classes/ShoppingCart');

const setDefaultSessionData = (req, res, next) => {
	const shoppingCart = new ShoppingCart(req);
	req.session.user = req.session.user || {};
	req.session.user.id = req.session.user.id || false;
	req.session.user.admin = req.session.user.admin || false;
	req.session.user.adminMode = req.session.user.adminMode || false;
	req.session.user.root = req.session.user.root || false;
	next();
}

// обработка необработанных ошибок, возникающий в промисах (unhandled rejection);
// не знаю куда его вынести
process.on('unhandledRejection', (error, p) => {
	console.log(error);
	console.error(error.message);

	fs.appendFileSync(path.join(__dirname, '..', 'logs', 'unhandledRejection-log.log'), new Date().toLocaleString() + ': ' + error.stack + '\n\n');
});

app.use(setDefaultSessionData);

// инизиализация переменных в приложении
app.db = db;
app.ejs = ejs;
app.Model = Model;
app.express = express;
app.locals.routesList = {};
app.locals.libs = path.join(__dirname, 'libs');
app.componentsPath = path.join(__dirname, 'components');
app.locals.uploadDir = path.join(__dirname, 'public', 'uploads');
app.locals.uploadDirPanorams = path.join(__dirname, 'public', 'uploads/panorams');
app.locals.tempUploadDir = path.join(__dirname, 'public', 'uploads', 'temp');
app.Helpers = app.locals.Helpers = require('./libs/Helpers');

global.app = app;

global.DocumentRoot = __dirname;
global.AppRoot = path.join(__dirname);
app.publicDir = global.PublicDir = path.join(__dirname, 'public');
app.viewsDir = global.ViewsDir = path.join(__dirname, 'views');

global.imagesPath = 'http://system.mpkpru.ru/';

db.connect().then(async () => {

	await require('./siteConfig')(app);
	
	await require('./libs/routeHandler').initRoutesList();
	
	// подключение обработчика маршрутов
	const routeHandler = require('./libs/routeHandler').Router(app);
	const errorHandler = require('./functions/error-handler');

	await require('./services/sendSms').init(app);
	await require('./services/sendEmail/').init(app);
	await require('./componentsList')(app);
	await require('./socialLinks')(app);
	// await require('./aliases')(app);

	// маршруты выгрузки товаров
	app.use(`/api/unloading`, require('./unloading'));

	// общие маршруты приложения
	app.use(require('./appRoutes'));
	app.use(routeHandler);
	app.use(errorHandler);

	app.listen(config.web.port, (err) => {
		if (err) return console.log("Ошибка запуска сервера:" + err.message);
		console.log("Сервер запущен на порту " + config.web.port);
	})
});
