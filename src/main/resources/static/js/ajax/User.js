define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';

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
      url     : "api/v1/users/profile/password",
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
    changePassword
  };


});