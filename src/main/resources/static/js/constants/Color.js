define([
  'underscore'
],function(_){

  const getColorByBgColor = (bgColor)=> {
    if (!bgColor) { return ''; }
    return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
  }      

  const getLabelByStatus = (s) => {
    if(_.isEmpty(s)){
      return 'label-default'; 
    } 

    switch(s.toUpperCase()) {
      case 'IDLE': return 'label-warning';
      case 'DONE': return 'label-success';
      case 'SUCCESS': return 'label-success'; 
      case 'ERROR': return 'label-danger';
      case 'KILLED': return 'label-danger';
      case 'BLOCKED': return 'label-default';
      case 'RUNNING': return 'label-info';
    }   
    return 'label-default';
  };


  const paintDate = (d) => {
    let dm = !d ? '':moment(d).format("DD MMM");
    let hms= !d ? '':moment(d).format("HH:mm:ss");
    return `
      <span class='text-green'>${dm}</span>
      <span class='text-red-plum'>${hms}</span>
    `;
  };

  return {
    getColorByBgColor,
    getLabelByStatus,
    paintDate
  };
});