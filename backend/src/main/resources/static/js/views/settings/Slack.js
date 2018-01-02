define([
  'underscore',
  'backbone',
  'text!templates/settings/html/slack.html',
  'plugins/Message',
  'collections/SettingStore',
  'models/SettingModel',
  'constants/index',
  'ajax/Slack'
], function (_, Backbone, template, Message, SettingStore, SettingModel, Constants, AjaxSlack) {
  'use strict';

  let Slack = Backbone.View.extend({

    tagName: 'section',
    className: 'content js-slack',
    template: _.template(template),

    events: {
      "click .js-cancel-btn": "onCancel",
      "click .js-save-btn": "onSave",
      "click .js-test-btn": "onTest",
      "input input": "validate",
      "change input[id^='checkbox']" :"validate"
    },

    onCancel: function () {
      window.history.back();
    },

    onSave: function () {
      const me = this,
        param = {
          name : Constants.Settings.SLACK,
          value: JSON.stringify(me.getProps())
        };

      const loading = Ladda.create(document.querySelector('.js-slack .js-save-btn'));
      loading.start();

      const onSuccess = function () {
        if (!param.id) {
          SettingStore.add(me.model);
        }
        Message.notifySuccess('Slack settings saved');
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
        const m = SettingStore.findWhere({name:Constants.Settings.SLACK});
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
      this.$el.find(`[name="taskError"][_value="${m.notifications.taskError}"]`).prop('checked', "1");
      this.$el.find(`[name="taskBlocked"][_value="${m.notifications.taskBlocked}"]`).prop('checked', "1");
      this.$el.find(`[name="taskDone"][_value="${m.notifications.taskDone}"]`).prop('checked', "1");
      this.$el.find(`[name="taskKilled"][_value="${m.notifications.taskKilled}"]`).prop('checked', "1");
      this.$el.find('input[name="channel"]').val(m.channel);
      this.$el.find('input[name="url"]').val(m.url);
      return this;
    },

    onTest: function(){
      AjaxSlack.test(this.getProps());
    },

    getProps: function () {
      let p = {
        notifications:{}
      };
      
      p.active = this.$el.find('[name="active"]:checked').attr('_value');
      p.notifications.taskError = this.$el.find('[name="taskError"]:checked').attr('_value');
      p.notifications.taskBlocked = this.$el.find('[name="taskBlocked"]:checked').attr('_value');
      p.notifications.taskDone = this.$el.find('[name="taskDone"]:checked').attr('_value');
      p.notifications.taskKilled = this.$el.find('[name="taskKilled"]:checked').attr('_value');
      p.channel = this.$el.find('input[name="channel"]').val();
      p.url = this.$el.find('input[name="url"]').val();

      return p;
    },

    validate: function () {
      const props = this.getProps();
      let isValid = true;
      isValid = !(_.isEmpty(props.channel) || _.isEmpty(`${props.url}`));
      this.enableActionButtons(isValid);
      return this;
    },

    enableActionButtons: function (enable) {
      if (enable) {
        this.$el.find('.js-save-btn, .js-test-btn').removeClass('disabled');
      } else {
        this.$el.find('.js-save-btn, .js-test-btn').addClass('disabled');
      }
    },

    initialize: function (id) {
      this.modelId = id;
      return this;
    },

    render: function (id) {
      this.$el.html(this.template());
      this.setValues(id);
      this.validate();
      return this;
    }
  });

  return Slack;
});