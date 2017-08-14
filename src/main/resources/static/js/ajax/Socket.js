define([
	'underscore',
  'plugins/Message',
  'ajax/User'
], function (_, Message, User) {
	'use strict';
   
  const socket = new SockJS('/socket');
  const stomp = Stomp.over(socket);
  stomp.connect({}, function (f) {
    stomp.subscribe('/topic/task-instance-error', function (d) {
      if(User.me.deno && User.me.deno.taskError){
        const instance = JSON.parse(d.body);
        Push.create('Task Crash',{
          body: `${instance.name} crashed`,
          icon: 'img/octo-red-32.png'
        });
        if(User.me.deno.sound){
          const audio = new Audio('sound/error.mp3');
          audio.play();
        }
      } 
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