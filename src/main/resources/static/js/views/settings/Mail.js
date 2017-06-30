define([
  'underscore',
  'backbone',
  'text!templates/settings/html/mail.html',
  'plugins/Message',
  'collections/SettingStore',
  'models/SettingModel',
  'constants/index'
], function (_, Backbone, template, Message, SettingStore, SettingModel, Constants) {
  'use strict';

  let Mail = Backbone.View.extend({

    tagName: 'section',
    className: 'js-mail',
    template: _.template(template),

    events: {
      "click .js-cancel-btn": "onCancel",
      "click .js-save-btn": "onSave",
      "input input": "validate",
      "change input[id^='radio']" :"validate"
    },

    onCancel: function () {
      window.history.back();
    },

    onSave: function () {
      const me = this,
        param = {
          name : Constants.Settings.MAIL,
          value: JSON.stringify(me.getProps())
        };

      const loading = Ladda.create(document.querySelector('.js-mail .js-save-btn'));
      loading.start();

      const onSuccess = function () {
        if (!param.id) {
          SettingStore.add(me.model);
        }
        Message.notifySuccess('Mail settings saved');
      },
        onError = function (err, response) {
          Message.notifyDanger(response.responseJSON.message);
        },
        onComplete = function () {
          loading.stop();
          loading.remove();
        };

      this.model.save(param, {
        success: onSuccess,
        error: onError,
        complete: onComplete
      });
    },

    setValues: function (id) {
      
      if(id == undefined){
        const m = SettingStore.findWhere({name:Constants.Settings.MAIL});
        if(!_.isEmpty(m)){
          id = m.get('id');
        }
      }
      this.model = SettingStore.get(id) || new SettingModel();
      const v = this.model.attributes.value;
      
      if(_.isEmpty(v)) return this;
      
      const m = JSON.parse(this.model.attributes.value);
      this.modelId = id;
      
      this.$el.find(`[name="active"][_value="${m.active}"]`).prop('checked', "1");
      this.$el.find('input[name="host"]').val(m.host);
      this.$el.find('input[name="port"]').val(m.port);
      this.$el.find('input[name="username"]').val(m.username);
      this.$el.find('input[name="password"]').val(m.password);
      this.$el.find('input[name="sendFrom"]').val(m.sendFrom);
      this.$el.find('[name="sendTo"]').val();
      this.$el.find(`[name="sendTo"][_value="${m.sendTo}"]`).prop('checked', "1");
      this.$el.find(`[name="consec"][_value="${m.connectionSecurity}"]`).prop('checked', "1");

      return this;
    },


    getProps: function () {
      let p = {};
      
      p.active = this.$el.find('[name="active"]:checked').attr('_value');
      p.host = this.$el.find('input[name="host"]').val();
      p.port = parseInt(this.$el.find('input[name="port"]').val());
      p.username = this.$el.find('input[name="username"]').val();
      p.password = this.$el.find('input[name="password"]').val();
      p.sendFrom = this.$el.find('input[name="sendFrom"]').val();
      p.sendTo   = this.$el.find('[name="sendTo"]:checked').attr('_value');
      p.connectionSecurity = this.$el.find('[name="consec"]:checked').attr('_value');
      return p;
    },

    validate: function () {
      const props = this.getProps();
      let isValid = true;
      isValid = !(_.isEmpty(props.host) || _.isEmpty(`${props.port}`));
      this.enableActionButtons(isValid);
      return this;
    },

    enableActionButtons: function (enable) {
      if (enable) {
        this.$el.find('.js-save-btn').removeClass('disabled');
      } else {
        this.$el.find('.js-save-btn').addClass('disabled');
      }
    },

    initialize: function (id) {
      this.modelId = id;
      return this;
    },

    render: function (id) {
      this.$el.html(this.template());
      this.setValues(id);
      return this;
    }
  });

  return Mail;
});