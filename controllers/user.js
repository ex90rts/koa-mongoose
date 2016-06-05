/**
 * Created by ex90rts on 6/5/16.
 */
'use strict';

const UserModel = require('../models/user');

//列出所有用户数据，支持分页
exports.list = function *(){
    let page = this.query.page || 1;
    let limit = 10;
    let skip = (page-1)*limit;
    this.body = yield UserModel.find({}, null, {skip: skip, limit: limit});
};

//插入一条新数据，实际应用中应该读取客户端POST数据，本示例仅仅模拟
exports.insert = function *(){
    //下面都是随机造假数据
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

    //插入新数据
    let doc = {
        username: username,
        password: "dasiwoyebushuo",
        roles: roles,
        magazines: magazines
    };

    let ret = yield new UserModel(doc).save();
    this.body = ret;
};

//返回所有的编辑数据
exports.editors = function *(){
    this.body = yield UserModel.findByRoles('editor');
};

//返回指定杂志的所有编辑数据
exports.magazineEditors = function *(magazine){
    if (!magazine){
        magazine = "Golf";
    }
    this.body = yield UserModel.findByMagazine(magazine);
};

//返回指定杂志类型的所有编辑数据
exports.typeEditors = function *(type){
    if (!type){
        type = "business";
    }
    this.body = yield UserModel.findByMagazineType(type);
};

//查找所有被雇佣的用户（有杂志数据的，身份可能是编辑或作者）
//增加一个editor属性，当身份是编辑时为true
exports.hired = function *(){
    let users = yield UserModel.find({"magazines.0":{$exists: true}});

    let ret = [];
    users.forEach((doc)=>{
        //需要使用toObject方法先转换成普通对象，否则增加的editor属性是无法返回的
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

//雇佣一个用户，传入用户名（也可以使用ID，但是我们用户名有唯一索引，因此也OK）
//同时需要接收POST的杂志名称和角色，这里为了演示，直接使用默认值
exports.hire = function *(username){
    //const bodyParser = require("co-body");
    //let postData = yield bodyParser(this.request);
    let postData = {};//真实环境请将route改成post类型，并使用上面一行代码
    let magazine = postData.magazine || "Golf";
    let role = postData.role || "author";

    //杂志类型应该到相应的杂志collection中查询，这里模拟
    //let magazineDoc = yield MagazineModel.findByName(magazine);
    //let magazineType = magazineDoc.type;
    let magazineType = "sports";

    let user = yield UserModel.findByUsername(username);
    if (user){
        if (user.roles.indexOf("author")===-1){
            user.roles.push("author");
        }

        //判断用户是否已经关联该杂志的动作省略
        user.magazines.push({
            name: magazine,
            type: magazineType
        });

        //可以检查一下user.updated自动是否更新成功了哦
        this.body = yield user.save();
    }else{
        this.body = {error:"1001", msg:`User <$username> not exist`};
    }
};