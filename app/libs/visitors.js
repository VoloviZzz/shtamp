const Model = require('../models');

exports.createVisitor = async function createVisitor(req, res, next) {
    if (typeof req.session.user.visitorId == 'undefined' && req.session.user.id !== true) { // если посетитель не был идентифицирован
        let [error, visitorId] = await Model.visitors.add() // создаем нового посетителя

        if (error) {
            console.log('Ошибка создания посетителя');
            console.log(error);
        }
        req.session.user.visitorId = visitorId;
    }
    else if (req.session.user.id == true) {
        req.session.user.visitorId = req.session.user.id;
    }

    return next();
}