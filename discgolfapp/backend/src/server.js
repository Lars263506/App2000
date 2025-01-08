import express from 'express';
import webpagesRoutes from './routes/webpagesRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log("Request method: " + req.method, "\n" + "Request path: " + req.path);
    next();
});

app.use('/api/webpages', webpagesRoutes);
app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => {
    console.log("Listening on port ", process.env.PORT);
});