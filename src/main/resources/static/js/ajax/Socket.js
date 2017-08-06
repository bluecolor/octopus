define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';
   
  const socket = new SockJS('/socket');
  const stomp = Stomp.over(socket);
  stomp.connect({}, function (f) {
    stomp.subscribe('/topic/task-instance', function (d) {
      const instance = JSON.parse(d.body);
      Push.create('Task Crash',{
         body: `${instance.name} crashed`,
         icon: 'img/octo-red-32.png'
      });
      const audio = new Audio('sound/just-like-that.mp3');
      audio.play();  
    });
  },function(e){
    console.log(e)
  });
  
  const connect = () => {

  };
    
  return {
    connect
  }


});