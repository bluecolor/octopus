define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';

  let me = {
    options: ''
  };

  me.opts = function() { if(me.options) return JSON.parse(me.options); };

  me.setOptions = (o) => {
    if(o){
      me.options = JSON.stringify(o);
    }
  };

  const init = function(){
    const that = this;
    findMe().done(function(d){
      that.me = $.extend(that.me,d);
      $('.js-nav-username').text(d.username)
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

  const updateOptions = (o, cb) =>{
    let error = function(e){
      console.log(e);
      Message.error('Unable to update preferences!');
    };
    return $.ajax({
      url     : "api/v1/users/options",
      data    : JSON.stringify(o),
      dataType: 'json',
      contentType: 'text/plain',
      type    : 'put',
      error   : error,
      success : function(){
        if(cb){cb();}
        Message.success('Preferences saved');
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
    updateOptions,
    changePassword,
    me,
    init,
    hasAccess
  };


});