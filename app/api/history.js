

exports.activeToggle = (req, res, next) => {
	const Model = req.app.Model;
	return Model.history.upd(req.body).then(([error, result]) => {
		if (error) return { message: error.message, error };
		return { status: 'ok' }
	})
}

exports.addEvent = (req, res, next) => {
	const Model = req.app.Model;
	return Model.history.add().then(([error, rows]) => {
		if (error) return { message: error.message, error };
		return { status: 'ok', data: rows}
	})
}

exports.removeEvent = (req, res, next) => {
	const Model = req.app.Model;
	return Model.history.del({ id: req.body.id }).then(([error, rows]) => {
		if (error) return { message: error.message, error };
		return { status: 'ok' }
	})
}

exports.saveEvent = (req, res, next) => {
	const Model = req.app.Model;
  var keys = Object.keys(req.body);
  var arg = {
    value:req.body['title'],
    target:'title',
    id:req.body['id']
  }
  return Model.history.upd(arg)
  .then(() => {
    var keys = Object.keys(req.body);
    var arg = {
      value:req.body['img'],
      target:'img',
      id:req.body['id']
    }
    return Model.history.upd(arg)
  })
	.then(() => {
    var keys = Object.keys(req.body);
    var arg = {
      value:req.body['desc'],
      target:'`desc`',
      id:req.body['id']
    }
    return Model.history.upd(arg)
  })
	.then(() => {
    var keys = Object.keys(req.body);
    var arg = {
      value:req.body['date'],
      target:'`created`',
      id:req.body['id']
    }
    return Model.history.upd(arg)
  })
  .then(() => {
		return { status: 'ok'};
	});
}
