const express = require('express');

const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));

app.use(require('./middlewares/parseReqBody'));
app.use(require('./middlewares/requestLogTime'));

app.get(`/`, require('./routes/home'));

app.post(`/ping`, require('./routes/ping'));

app.post('/addConnection', require(`./routes/addConnection`));
app.post('/updateConnection', require(`./routes/updateConnection`));

app.post(`/addPositions`, require(`./routes/positions`).add);
app.post(`/getPositions`, require(`./routes/positions`).get);
app.post(`/updatePositions`, require(`./routes/positions`).update);
app.post(`/deletePositions`, require('./routes/positions').delete);
app.get(`/getCategories`, require('./routes/getCategories'));
app.post(`/getCategories`, require('./routes/getCategories'));

app.post(`/deletePhotos`, require('./routes/photos').delete);
app.post(`/uploadPhotos`, require('./routes/photos').upload);

app.post('/connectionResponse', require('./routes/connectionResponse'));

app.use(require('./middlewares/errorHandler'));

module.exports = app;