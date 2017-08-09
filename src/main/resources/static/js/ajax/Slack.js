define([
	'underscore',
  'collections/ConnectionStore',
  'plugins/Message',
], function (_, ConnectionStore, Message) {
	'use strict';

  const test = function(o, cb){
    
    waitingDialog.show('Testing Slack', {dialogSize: 'sm', progressType: 'info'});
    waitingDialog.animate();
    

    let success = function(){
      Message.notifySuccess('Sent test message to channel #'+ o.channel);
      if(cb && cb.success){
        cb.success();
      }
    }, 
    error = function(e){
      Message.notifyDanger(`Unable send message ${e.responseJSON.message}`);
      if(cb && cb.error){
        cb.error();
      }
    },
    complete= function(){
      waitingDialog.hide();
    };


    return $.ajax({
      url     : '/api/v1/slack/test',
      dataType: 'json',
      type    : 'post',
      contentType: 'application/json',
      data    : JSON.stringify(o),
      error   : error,
      success : success,
      complete: complete
    });
  };

  return {
    test,
  } 


});