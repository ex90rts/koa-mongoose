/**
 * Created by ex90rts on 6/5/16.
 */
'use strict';

const UserModel = require('../models/user');

exports.index = function *(){
    //找一个可以雇佣的人
    let user = yield UserModel.findJobless();

    let links = [
        "<a href='/user/insert'>新建用户</a>",
        "<a href='/user/list'>全部用户</a>",
        "<a href='/user/editors'>所有编辑</a>",
        "<a href='/user/editors/Golf'>Golf用户</a>",
        "<a href='/user/editors/type/sports'>体育杂志用户</a>",
        "<a href='/user/hired'>已雇佣用户</a>"
    ];
    if (user){
        links.push("<a href='/user/hire/"+ user.username +"'>雇佣新用户</a>");
    }else{
        links.push("雇佣新用户(暂时没有无业人员哦，请先访问几次新建用户)");
    }

    this.body = links.join("<br />");
};