const HeaderNav = require('../libs/header-nav');

exports.upd = async function (req, res, next) {
    const { id, target, value } = req.body;
    return await HeaderNav.updateHeaderNav({ id, target, value }).then(([error, result]) => {
        if (error) return { message: error.message }
        return { status: 'ok' };
    })
}

exports.add = async function (req, res, next) {
    const { parentId } = req.body;
    return await HeaderNav.addHeaderNav({ parentId }).then(([error, result]) => {
        if (error) return { message: error.message }
        return { status: 'ok' };
    })
}

exports.delete = async function (req, res, next) {

    const { id } = req.body;

    return await HeaderNav.deleteHeaderNav({ id }).then(([error, result]) => {
        if (error) return { message: error.message }
        return { status: 'ok' };
    })
}