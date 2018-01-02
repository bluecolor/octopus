define([
	'underscore'
], function (_) {
	'use strict';

  const MESSAGE_POS = ['top', 'center']; 


  const confirmDanger = (o) =>{
    
    o.buttonLabel = o.buttonLabel ||
    'I understand the consequences, take this action';

    const $msg = $(`
        <div class="form-group">
        <div class="facebox-alert" data-facebox-id="facebox-description" id="facebox-description">
          Unexpected bad things will happen if you don’t read this!
        </div>
        <p style="margin-bottom:20px">This action <strong>CANNOT</strong> be undone. 
          This will permanently delete the <strong>${o.name}</strong> 
          and all the objects, that are directly or indirectly related, to this object.
        </p>
        <input name="name" type="text" required="required" class="form-control" autocomplete="off"/>
        </div>
    `);

    BootstrapDialog.show({
        type: BootstrapDialog.TYPE_DEFAULT,  
        title: 'Are you ABSOLUTELY sure?',
        message   : $msg,
        draggable : true,
        autospin  : true,
        onshow    : function(dialog){
          let b = dialog.getButton('confirm-btn');
          b.disable();
          $msg.find('input[name="name"]').on('input', function(){
            if(this.value == o.name){
              b.enable();
            }else{
              b.disable();
            }
          });
        },
        buttons: [{
          id: 'confirm-btn',
          label: o.buttonLabel,
          cssClass: 'btn-block btn-danger',
          hotkey: 13,
          action: o.action
        }]
      });
  };

  const notifySuccess = (msg) => {
    $.notify({message:msg},{
      type: 'success',
      placement: {from: MESSAGE_POS[0], align:MESSAGE_POS[1]}
    });
  };

  const notifyDanger = (msg) => {
    $.notify({message:msg},{
      type: 'danger',
      placement: {from: MESSAGE_POS[0], align:MESSAGE_POS[1]}
    });
  };

  const warning = (msg) => {
    $.notify({message:msg},{
      type: 'warning',
      placement: {from: MESSAGE_POS[0], align:MESSAGE_POS[1]}
    });
  };

  const success = notifySuccess,
    danger = notifyDanger,
    error = notifyDanger;


	return {
    confirmDanger,
    notifySuccess,
    notifyDanger,
    success,
    danger,
    error,
    warning
  };
});