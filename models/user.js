/**
 * Created by ex90rts on 6/5/16.
 */
'use strict';

const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//type: filed type, String,Number,Date,Buffer,Boolean,Mixed,ObjectId,Array
//index: is database index needed for the filed, pay attention to unique index
//default: the default value
const User = new Schema({
    "username": { type: String, index:  {unique: true, dropDups: true} },
    "password": { type: String, match: /\w+/, index: true },
    "roles": { type: Array, default: [], index: true },
    "magazines": { type: Array, default: [] },
    "created": { type: Date, default: Date.now, index: true },
    "updated": { type: Date, default: Date.now, index: true },
});

// Use the setter feature to hash the password text before save, while it's for the safety.
User.path('password').set(function(v){
    let shasum = crypto.createHash('sha1');
    shasum.update(v);
    return shasum.digest('hex');
});

// user middleware to auto update the field 'updated' while you changed any other things
User.pre('save', function(next){
    this.updated = Date.now();
    next();
});

// Static method: find an user by username value
// use findOne method here becase we just need to query one record
User.statics.findByUsername = function(username){
    return this.findOne({username: username});
};

//Static method: find all user by roles
User.statics.findByRoles = function(roles){
    if (!Array.isArray(roles)){
        roles = [roles];
    }
    return this.find({roles:{$in:roles}});
};

//Static method: find all user by magazine
User.statics.findByMagazine = function(magazine){
    return this.find({"magazines.name": magazine});
};

//Static method: find all user by magazine type
User.statics.findByMagazineType = function(magazineType){
    return this.find({"magazines.type": magazineType});
};

//Static method: find an user who doesn't have a job yet( not an editor nor an author)
User.statics.findJobless = function(){
    return this.findOne({roles:{$nin:["editor", "author"]}});
};

// instance method, check if this user is an editor of current model instance
User.methods.isEditor = function(){
    return this.roles.indexOf("editor")!==-1;
};

// create the model
const model = mongoose.model('User', User);

module.exports = model;
