const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const fs = require('fs');
// const path = require('path');

const HttpError = require('./models/http-error');
const userRoutes = require('./routes/users-routes');



const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // 또는 구체적인 출처를 명시
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});
//CORS 오류 해결

// app.use('/api/works', workRoutes); //API 라우트 정의
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
})

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
    .connect(
        'API_KEY',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(() => {
        app.listen(5000)
    }
    )
    .catch((err) => {
        console.log(err);
    })

