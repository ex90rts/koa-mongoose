/**
 * Created by ex90rts on 6/5/16.
 */
'use strict';

const koa = require('koa');
const route = require('koa-route');
const mongoose = require('mongoose');

// import controllers, P.S.: the purpose of this demo is not about koa, so I just skipped the 'view' layer
const indexController = require('./controllers/index');
const userController = require('./controllers/user');

const app = koa();
app.on('error', function(err){
    console.error(err.stack);
    console.log(err.message);
});

// route configuration. Attention: /user/insert and /user/hire should changed to route.post 
// in the real project and you need to import co-body middleware as while
app.use(route.get('/', indexController.index));
app.use(route.get('/user/list', userController.list));
app.use(route.get('/user/insert', userController.insert));
app.use(route.get('/user/editors', userController.editors));
app.use(route.get('/user/editors/:magazine', userController.magazineEditors));
app.use(route.get('/user/editors/type/:type', userController.typeEditors));
app.use(route.get('/user/hired', userController.hired));
app.use(route.get('/user/hire/:username', userController.hire));

// start the server, listen to port 3000
app.listen(3000, ()=>{console.log('Server started, please visit: http://127.0.0.1:6000');});

// the following code are about connection to MongoDb, you probably should isolate these code
// to an independent file, while I just too lazy to do it ;）

// connect to MongoDB, you should disable autoIndex in production env for performance reason
const connString = 'mongodb://localhost:27017/test';
mongoose.connect(connString, { /*config: { autoIndex: false }*/ });

// callback after MongoDB was connected, we just show a log message here
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + connString);
});

// callback after any error occurred by MongoDB, we just show a log message here
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// callback after MongoDB was disconnected, we just show a log message here
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// close MongoDB connection after current server process was terminated
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed through app termination');
        process.exit(0);
    });
});
