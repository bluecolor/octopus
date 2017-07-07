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

  return {
    Route,
    Technology,
    getPriority,
    Color,
    Status,
    Settings,
    Role
  }
});