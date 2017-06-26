define([
],function(){

  const error = {
    TASK_INSTANCE_ERROR : "TASK_INSTANCE_ERROR",
  };

  const objtp = {
    TASK_INSTANCE: 'TASK_INSTANCE' 
  } 


  const errorHuman = (e) => {
    switch (e) {
      case error.TASK_INSTANCE_ERROR: return 'Session task error';
    }
  };

  const objtpHuman = (t) => {
    switch (t) {
      case objtp.TASK_INSTANCE: return 'Session task';
    }
  } 

  return {
    error,
    objtpHuman
  };
});