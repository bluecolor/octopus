define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';

  let me = {};

  const init = function(){
    const that = this;
    findMe().done(function(d){
      that.me = d;
    });
  }

  const hasAccess = function(role){
    role = role || "GUEST";
    if(this.me.role === "MASTER") return true;
    const roleIndex = {guest:1,operator:2,master:3};
    return roleIndex[role.toLowerCase] <= roleIndex[this.me.role.toLowerCase]
  }


  const findMe = ()=> {
    return findCurrentUser();
  }

  const findCurrentUser = ()=> {
    return $.ajax({
      url     : 'api/v1/users/me',
      dataType: 'json',
      type    : 'get',
      contentType: 'application/json'
    });
  };

  const updateProfile = (p) =>{
    let error = function(){
      Message.error('Unable to update profile!');
    };
    return $.ajax({
      url     : "api/v1/users/profile",
      data    : JSON.stringify(p),
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error,
      success : function(){
        Message.success('Profile updated');
      }
    });
  };

  const changePassword = (p) =>{
    let error = function(){
      Message.error('Unable change password!');
    };
    return $.ajax({
      url     : "api/v1/users/password",
      data    : JSON.stringify(p),
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error,
      success : function(){
        Message.success('Password changed');
      }
    });
  };
  

  return {
    findMe,
    findCurrentUser,
    updateProfile,
    changePassword,
    me,
    init,
    hasAccess
  };


});