<template lang="pug">
.row
  .col-md-6.col-md-offset-3  
    .box.box-primary
      .box-header.with-border
        h3.box-title Slack Settings
      form(role='form')
        .box-body
          .form-group
            label Slack service active
            fieldset
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-service-1(type='radio', name='active', _value='yes', checked='1')
                label(for='radio-service-1')
                  | Yes
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-service-2(type='radio', name='active', _value='no')
                label(for='radio-service-2')
                  | No
          
          .form-group
            label Notifications
            fieldset
              .checkbox.checkbox-info
                input#task-error(type='checkbox', name='taskError', _value='yes', checked='1')
                label(for='task-error')
                  | Enable slack notifications for 
                  strong task errors 
              .checkbox.checkbox-info(style="padding-top:7px;")
                input#task-killed(type='checkbox', name='taskKilled', _value='yes')
                label(for='task-killed')
                  | Enable slack notifications for 
                  strong killed tasks 
              .checkbox.checkbox-info(style="padding-top:7px;")
                input#task-blocked(type='checkbox', name='taskBlocked', _value='yes')
                label(for='task-blocked')
                  | Enable slack notifications for 
                  strong blocked tasks 
              .checkbox.checkbox-info(style="padding-top:7px;")
                input#task-done(type='checkbox', name='taskDone', _value='yes')
                label(for='task-done')
                  | Enable slack notifications for 
                  strong tasks made done
          .form-group
            label Channel
            input.form-control(name="channel" type='text' placeholder='# Slack channel ')
          .form-group
            label Webhook Url
            input.form-control(name="url" type='text' placeholder='https://hooks.slack.com/services/...')
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.disabled.ladda-button.btn.btn-primary.pull-right(data-style="expand-left") Save
          a.disabled.ladda-button.btn.btn-warning.pull-right(data-style="expand-left" style="margin-right:10px;") Test  
</template>

<script>
export default {
  name: 'SlackSettings',
  data () {
    return {}
  },
  methods: {
    close () {
      window.history.back()
    }
  }
}
</script>
