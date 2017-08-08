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
      case 'STOPPED': return 'label-danger';
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

  const randomColor =() => {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  function randomRgba(a) {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + a + ')';
  }


  return {
    getColorByBgColor,
    getLabelByStatus,
    paintDate,
    randomColor,
    randomRgba
  };
});