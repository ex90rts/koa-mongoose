/**
 * Created by ex90rts on 6/5/16.
 */
'use strict';

const koa = require('koa');
const route = require('koa-route');
const mongoose = require('mongoose');

// 引入controller层，PS：本例重点不在koa，因此view层不做
// 实现，controller层均输出json数据
const indexController = require('./controllers/index');
const userController = require('./controllers/user');

const app = koa();
app.on('error', function(err){
    console.error(err.stack);
    console.log(err.message);
});

// 路由配置，注意：/user/insert 和 /user/hire 在真实环境应该改为 route.post
// 切需要引入co-body中间件
app.use(route.get('/', indexController.index));
app.use(route.get('/user/list', userController.list));
app.use(route.get('/user/insert', userController.insert));
app.use(route.get('/user/editors', userController.editors));
app.use(route.get('/user/editors/:magazine', userController.magazineEditors));
app.use(route.get('/user/editors/type/:type', userController.typeEditors));
app.use(route.get('/user/hired', userController.hired));
app.use(route.get('/user/hire/:username', userController.hire));

// 启动服务，监听3000端口
app.listen(3000, ()=>{console.log('Server started, please visit: http://127.0.0.1:6000');});

// 以下MongoDB连接相关代码页可以独立出去，这里偷懒了
// 连接MongoDB, 在生产环境应该禁用autoIndex，因为会造成性能问题
const connString = 'mongodb://localhost:27017/test';
mongoose.connect(connString, { /*config: { autoIndex: false }*/ });

// MongoDB连接成功后回调，这里仅输出一行日志
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + connString);
});

// MongoDB连接出错后回调，这里仅输出一行日志
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// MongoDB连接断开后回调，这里仅输出一行日志
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// 当前进程退出之前关闭MongoDB连接
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed through app termination');
        process.exit(0);
    });
});