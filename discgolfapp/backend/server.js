require('dotenv').config();

const express = require('express');
const webpagesRoutes = require('./routes/webpagesRoutes');

const app = express();

app.use((req, res, next) => {
    console.log("Request method: " + req.method, "\n" + "Request path: " + req.path);
    next();
});

app.use('/api/webpages', webpagesRoutes);

app.listen(process.env.PORT, () => {
    console.log("Listening on port ", process.env.PORT);
});