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
                input#radio-service-1(v-model="s.active" type='radio', name='active' value=1 )
                label(for='radio-service-1')
                  | Yes
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-service-2(v-model="s.active" type='radio', name='active' value=0)
                label(for='radio-service-2')
                  | No
          
          .form-group
            label Notifications
            fieldset
              .checkbox.checkbox-info
                input#task-error(v-model="s.notifications.taskError" type='checkbox', name='taskError')
                label(for='task-error')
                  | Enable slack notifications for 
                  strong task errors 
              .checkbox.checkbox-info(style="padding-top:7px;")
                input#task-killed(v-model="s.notifications.taskKilled" type='checkbox' name='taskKilled')
                label(for='task-killed')
                  | Enable slack notifications for 
                  strong killed tasks 
              .checkbox.checkbox-info(style="padding-top:7px;")
                input#task-blocked(v-model="s.notifications.taskBlocked" type='checkbox' name='taskBlocked')
                label(for='task-blocked')
                  | Enable slack notifications for 
                  strong blocked tasks 
              .checkbox.checkbox-info(style="padding-top:7px;")
                input#task-done(v-model="s.notifications.taskDone" type='checkbox' name='taskDone')
                label(for='task-done')
                  | Enable slack notifications for 
                  strong tasks made done
          .form-group
            label Channel
            input.form-control(v-model="s.channel" placeholder='# Slack channel ')
          .form-group
            label Webhook Url
            input.form-control(v-model="s.url" placeholder='https://hooks.slack.com/services/...')
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.ladda-button.btn.btn-primary.pull-right(@click="onSave" data-style="expand-left") Save
          a.ladda-button.btn.btn-warning.pull-right(data-style="expand-left" style="margin-right:10px;") Test  
</template>

<script>

import _ from 'lodash'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'SlackSettings',
  data () {
    return {
      s: {
        active: 0,
        channel: undefined,
        url: undefined,
        notifications: {
          taskError: 1,
          taskBlocked: 0,
          taskDone: 0,
          taskKilled: 0
        }
      }
    }
  },
  computed: {
    ...mapGetters('settings', [
      'slack'
    ])
  },
  methods: {
    ...mapActions('settings', [
      'create',
      'update'
    ]),
    close () {
      window.history.back()
    },
    init () {
      if (this.slack) {
        this.s = _.cloneDeep(this.slack)
      }
    },
    onSave () {
      const name = 'SLACK'
      const value = JSON.stringify(this.s)
      const id = this.s.id
      if (id) {
        this.update({id, name, value})
      } else {
        this.create({name, value})
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
