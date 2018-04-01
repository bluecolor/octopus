<template lang="pug">
.row
  .col-md-6.col-md-offset-3
    .box.box-primary
      .box-header.with-border
        h3.box-title Options
      form(role='form')
        .box-body
          .form-group
            label Desktop notifications
            fieldset
              .radio.radio-inline.radio-success(style="display:inline")
                input#noti-enable(v-model="o.notifications.enabled" type='radio' value=1)
                label(for='noti-enable')
                  | Enabled
              .radio.radio-inline.radio-danger(style="display:inline")
                input#noti-disable(v-model="o.notifications.enabled" type='radio' value=0)
                label(for='noti-disable')
                  | Disabled
            fieldset
              .checkbox.checkbox-info.disabled
                input#session-complete(:disabled="o.notifications.enabled==0" v-model="o.notifications.sessionComplete" type='checkbox')
                label(for='session-complete')
                  | Notify when sessions complete
              .checkbox.checkbox-info
                input#sound-off(:disabled="o.notifications.enabled==0" v-model="o.notifications.sound" type='checkbox')
                label(for='sound-off')
                  | Turn off sound
          //- .form-group
          //-   label Appearance
          //-   fieldset
          //-     .checkbox.checkbox-info
          //-       input#hide-footer(v-model="o.appearance.footer" type='checkbox')
          //-       label(for='hide-footer')
          //-         | Show footer

        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.ladda-button.btn.btn-primary.pull-right(@click="onSave" data-style="expand-left") Save
</template>

<script>

import _ from 'lodash'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'SlackSettings',
  data () {
    return {
      o: {
        notifications: {
          enabled: 1,
          sessionComplete: 0,
          sound: 1
        },
        appearance: {
          footer: true
        }
      }
    }
  },
  computed: {
    ...mapGetters('users', [
      'options'
    ])
  },
  methods: {
    ...mapActions('users', [
      'saveOptions'
    ]),
    close () {
      window.history.back()
    },
    init () {
      if (this.options) {
        this.o = _.extend(this.o, this.options)
      }
    },
    onSave () {
      this.saveOptions(this.o)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
