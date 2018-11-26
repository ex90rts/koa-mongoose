# Koa and Mongoose Example


[For English Version, Click here !](https://github.com/ex90rts/koa-mongoose/tree/english)

Koa框架搭配Mongoose使用实例，主要演示了建立连接以及Model层的相关操作，如果你希望将本示例下载
到本地使用，请按照以下步骤操作：

## 安装并启动MongoDB服务

安装步骤很简单，[官方文档](https://docs.mongodb.com/manual/installation/)有详细说明。
示例使用的端口是默认端口27017，如果你自己有更改，请修改index.js中37行的`connString`。

## 安装依赖包并启动服务

> Node版本 >= 4.3.x

```
npm install
npm start
```

## 文件说明

```
├── README.md      本文件
├── controllers    控制器目录，route后具体请求的执行逻辑
│   ├── index.js   首页
│   └── user.js    用户
├── index.js       应用入口，route规则和MongoDB连接也在这个文件中
├── models         Mongoose模型目录
│   └── user.js    用户模型
├── package.json
└── views          视图层，未具体实现
    └── README.md
```
