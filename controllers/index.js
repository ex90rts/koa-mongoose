/**
 * Created by ex90rts on 6/5/16.
 */
'use strict';

const UserModel = require('../models/user');

exports.index = function *(){
    // find a guy to hire
    let user = yield UserModel.findJobless();

    let links = [
        "<a href='/user/insert'>Create New User</a>",
        "<a href='/user/list'>All Users</a>",
        "<a href='/user/editors'>All Editors</a>",
        "<a href='/user/editors/Golf'>Golf Users</a>",
        "<a href='/user/editors/type/sports'>Sports Users</a>",
        "<a href='/user/hired'>Hired User</a>"
    ];
    if (user){
        links.push("<a href='/user/hire/"+ user.username +"'>Hire An User</a>");
    }else{
        links.push("Hire An User(No unemployed user yet, please visit 'Create New User' page first)");
    }

    this.body = links.join("<br />");
};
