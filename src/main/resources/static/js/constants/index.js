define([
  'constants/Route',
  'constants/Technology',
  'constants/Color',
  'constants/Status',
  'constants/Settings',
  'constants/Role',
],function(Route, Technology, Color, Status, Settings, Role){

  const getPriority =(p)=>{
    switch (p){
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Top';
    }
  };

  const SocketTopic = {
    TASK_INSTANCE_ERROR : "task-instance-error", 
    TASK_INSTANCE_BLOCKED : "task-instance-blocked", 
    TASK_INSTANCE_DONE : "task-instance-done",
    TASK_INSTANCE_KILLED : "task-instance-killed"
  }; 

  return {
    Route,
    Technology,
    getPriority,
    Color,
    Status,
    Settings,
    Role,
    SocketTopic
  }
});