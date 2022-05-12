const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const loggerpac=require('morgan');
const router = express.Router();
var cors = require('cors');
var promise = require('bluebird');
var log4js = require('log4js');
const connectDB=require('./models/dbConnection');
const donorRoute = require('./routes/donor')
connectDB();
const port = 5000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(loggerpac('dev'));
app.use(cors());

app.use('/api/donor',donorRoute);

app.listen(port);


console.log(`App Runs on ${port}`);