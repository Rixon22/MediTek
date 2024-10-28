const routes = require('./api/endpoints');

const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
}));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});