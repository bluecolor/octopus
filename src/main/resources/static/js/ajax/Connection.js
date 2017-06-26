define([
	'underscore',
  'collections/ConnectionStore',
  'plugins/Message',
], function (_, ConnectionStore, Message) {
	'use strict';

  const test = function(c, cb){
    
    waitingDialog.show('Testing Connection', {dialogSize: 'sm', progressType: 'info'});
    waitingDialog.animate();
    
    let connection = c;
    if(!_.isObject(connection)){
      connection = ConnectionStore.get(c).attributes;
    }

    let success = function(){
      Message.notifySuccess('Connection works.');
      if(cb && cb.success){
        cb.success();
      }
    }, 
    error = function(e){
      Message.notifyDanger(`Unable to connect! ${e.responseJSON.message}`);
      if(cb && cb.error){
        cb.error();
      }
    },
    complete= function(){
      waitingDialog.hide();
    };


    return $.ajax({
      url     : '/api/v1/connections/test',
      dataType: 'json',
      type    : 'post',
      contentType: 'application/json',
      data    : JSON.stringify(connection),
      error   : error,
      success : success,
      complete: complete
    });
  };

  return {
    test,
  } 


});