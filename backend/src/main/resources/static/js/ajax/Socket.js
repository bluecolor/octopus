define([
	'underscore',
  'plugins/Message',
  'ajax/User',
  'constants/index'
], function (_, Message, User, Constants) {
	'use strict';
   
  const socket = new SockJS('/socket');
  const stomp = Stomp.over(socket);
  stomp.connect({}, function (f) {
    stomp.subscribe(`/topic/${Constants.SocketTopic.TASK_INSTANCE_ERROR}`, function (d) {
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

    stomp.subscribe(`/topic/${Constants.SocketTopic.TASK_INSTANCE_DONE}`, function (d) {
      if(User.me.opts().deno && User.me.opts().deno.taskDone){
        const body = JSON.parse(d.body);
        Push.create('Task Done',{
          body: `${body._1.name} done by ${body._2.name}`,
          icon: 'img/octo-green-32.png'
        });
        if(User.me.opts().deno.sound){
          const audio = new Audio('sound/error.mp3');
          audio.play();
        }
      } 
    });

    stomp.subscribe(`/topic/${Constants.SocketTopic.TASK_INSTANCE_BLOCKED}`, function (d) {
      if(User.me.opts().deno && User.me.opts().deno.taskBlocked){
        const body = JSON.parse(d.body);
        Push.create('Task Blocked',{
          body: `${body._1.name} blocked by ${body._2.name}`,
          icon: 'img/octo-gray-32.png'
        });
        if(User.me.opts().deno.sound){
          const audio = new Audio('sound/error.mp3');
          audio.play();
        }
      } 
    });

    stomp.subscribe(`/topic/${Constants.SocketTopic.TASK_INSTANCE_KILLED}`, function (d) {
      if(User.me.opts().deno && User.me.opts().deno.taskKilled){
        const body = JSON.parse(d.body);
        Push.create('Task Blocked',{
          body: `${body._1.name} killed by ${body._2.name}`,
          icon: 'img/octo-red-32.png'
        });
        if(User.me.opts().deno.sound){
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