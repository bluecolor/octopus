define([
],function(){

  const IDLE  = 'IDLE',
      DONE    = 'DONE',
      SUCCESS = 'SUCCESS', 
      ERROR   = 'ERROR', 
      KILLED  = 'KILLED',
      BLOCKED = 'BLOCKED',
      RUNNING = 'RUNNING';

  const progress = (instance) => {

    if([SUCCESS, DONE].indexOf(instance.status) != -1 ){
      return 100;
    }
    if([ERROR, IDLE, KILLED, BLOCKED].indexOf(instance.status) != -1 ){
      return 0;
    }
    
    if(instance.task.stats == null || instance.task.stats.avgDuration == null || instance.task.stats.avgDuration == 0){
      Math.floor( Math.random() * 100 );
    }

    if(instance.task.stats == null){
      return 0;
    }

    return Math.floor(100*moment
      .duration(moment(new Date())
      .diff(moment(instance.startDate)))
      .asSeconds()/instance.task.stats.avgDuration);

  };   

  return {
    IDLE, 
    DONE,   
    SUCCESS,
    ERROR,  
    KILLED, 
    BLOCKED,
    RUNNING,
    progress
  }
});