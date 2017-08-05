define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';
   
  const socket = new SockJS('/socket');
  const stomp = Stomp.over(socket);
  stomp.connect({}, function (f) {
    console.log('Connected');
    stomp.subscribe('/topic/task-instance', function (d) {
      const instance = JSON.parse(d.body);
      console.log(instance);
      Push.create('Task Crash',{
        silent: false,
        body: `${instance.name} crashed`
      });
    });
  },function(e){
    console.log(e)
  });
  
  
  
  
  const connect = function() {

  };
  
  
  return {
    connect,
  }


});