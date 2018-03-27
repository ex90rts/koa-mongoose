# Koa and Mongoose Example

A demonstration of using Mongoose with Koa.js app framework, mainly about how to create
connection and user Model to handle all kinds of MongoDB actions. If you want to run this
demo at your computer, plz follow these instructions :

## Install and start MongoDB

To install MongoDB is very simple, please check [Offical Docs](https://docs.mongodb.com/manual/installation/).

The default port 27017 of MongoDB is used in the demo code, you can change it in line 38 of index.js if you changed the
default port of MongoDB itself.

## Install all deps and start the server

> Node.js version >= 4.3.x

```
npm install
npm start
```

## Folders and files

```
├── README.md      It's me
├── controllers    Controller files, the handlers of all route
│   ├── index.js   Controller for index page
│   └── user.js    Controller for user model, most of them are RPCs
├── index.js       The app entrance, route config and MongoDB connection code are here
├── models         Mongoose Models
│   └── user.js    User Model
├── package.json
└── views          Views layer
    └── README.md
```
