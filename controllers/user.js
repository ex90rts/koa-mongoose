/**
 * Created by ex90rts on 6/5/16.
 */
'use strict';

const UserModel = require('../models/user');

// List all users data with pagination support
exports.list = function *(){
    let page = this.query.page || 1;
    let limit = 10;
    let skip = (page-1)*limit;
    this.body = yield UserModel.find().skip(skip).limit(limit);
};

// Insert a new user record. We just make some random data here to demo, you should 
// use POST data from client forms in the real world
exports.insert = function *(){
    // make dummy random data
    let suffix = Math.round(Math.random()*100);
    let baseNames = ["Sam", "Tom", "Jimmy", "Jack", "Kate", "Emma"];
    let randomIdx = Math.floor(Math.random()*baseNames.length);
    let username = baseNames[randomIdx] + suffix;
    let roles = ["reader"];
    if (suffix%3==0){
        roles.push("author");
    }
    if (suffix%5===0){
        roles.push("editor");
    }
    let magazinesTrunk = [
        {
            type: "art",
            name: "The Painting"
        },
        {
            type: "sports",
            name: "Golf"
        },
        {
            type: "fashion",
            name: "Style"
        },
        {
            type: "tech",
            name: "Swift"
        },
        {
            type: "business",
            name: "Harvard Business Review"
        },
        {
            type: "sports",
            name: "Football Weekend"
        }
    ];
    let magazines = magazinesTrunk.slice(randomIdx, randomIdx+3);

    // new data object to insert
    let doc = {
        username: username,
        password: "dasiwoyebushuo",
        roles: roles,
        magazines: magazines
    };

    let ret = yield new UserModel(doc).save();
    this.body = ret;
};

// return all editors data
exports.editors = function *(){
    this.body = yield UserModel.findByRoles('editor');
};

// return all editors data of a specific magazine
exports.magazineEditors = function *(magazine){
    if (!magazine){
        magazine = "Golf";
    }
    this.body = yield UserModel.findByMagazine(magazine);
};

// return all editors data of a specific type
exports.typeEditors = function *(type){
    if (!type){
        type = "business";
    }
    this.body = yield UserModel.findByMagazineType(type);
};

// return all hired users (which has magazine data, could be an editor or an author)
// add an new property for user object: editor, should be true while the user is an editor
exports.hired = function *(){
    let users = yield UserModel.find({"magazines.0":{$exists: true}});

    let ret = [];
    users.forEach((doc)=>{
        // need to convert the model object to literal object by toObject function,
        // otherwise the new property 'editor' won't be added in the final response
        let item = doc.toObject();
        item.editor = doc.isEditor();
        ret.push(item);

        /* not working
        doc.editor = doc.isEditor();
        ret.push(doc);
        */
    });

    this.body = ret;
};

// hire an user, pass in the username field as the param (while you also can use ID 
// field, we just need a unique identifier here)
// we also need to read magazine name and role from POST data of client side, we just
// use hardcode value here for demo
exports.hire = function *(username){
    // const bodyParser = require("co-body");
    // let postData = yield bodyParser(this.request);
    let postData = {};// plz change you route to POST type and use code above in real project
    let magazine = postData.magazine || "Golf";
    let role = postData.role || "author";

    // the magazine type should query from collection in real project by using the following code
    
    // let magazineDoc = yield MagazineModel.findByName(magazine);
    // let magazineType = magazineDoc.type;
    let magazineType = "sports";

    let user = yield UserModel.findByUsername(username);
    if (user){
        if (user.roles.indexOf("author")===-1){
            user.roles.push("author");
        }

        // you might need to check if this user already connected this magazine in the real project
        user.magazines.push({
            name: magazine,
            type: magazineType
        });

        // now you can check if user.updated field in database was updated automatically since we
        // used the middleware around https://github.com/ex90rts/koa-mongoose/blob/english/models/user.js#L31
        this.body = yield user.save();
    }else{
        this.body = {error:"1001", msg:`User <$username> not exist`};
    }
};
