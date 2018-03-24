<template lang="pug">
.row
  .col-md-6.col-md-offset-3
    .box.box-primary
      .box-header.with-border
        h3.box-title Mail Settings
      form(role='form')
        .box-body
          .form-group
            label Mail service active
            fieldset
              .radio.radio-inline.radio-success(style="display:inline")
                input#radio-service-1(v-model="m.active" name="active" type='radio' value=1)
                label(for='radio-service-1')
                  | Yes
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-service-2(v-model="m.active" name="active" type='radio' value=0)
                label(for='radio-service-2')
                  | No
          .row
            div.col-xs-9
              .form-group
                label Host
                input.form-control(v-model="m.host" placeholder='Host or IP Address')
            div.col-xs-3
              .form-group
                label Port
                input.form-control(v-model="m.port" type='number' min="1" max="65535")
          .form-group
            label Username
            input.form-control(v-model="m.username" placeholder='Username ...')
          .form-group
            label Password
            input.form-control(v-model="m.password" type='password' placeholder='Password ...')
          .form-group
            label Connection security
            fieldset
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-con-sec-ssl(v-model="m.connectionSecurity" type='radio', name='consec' value='ssl', checked='1')
                label(for='radio-con-sec-ssl')
                  | SSL
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-con-sec-tls(v-model="m.connectionSecurity" type='radio', name='consec', value='tls')
                label(for='radio-con-sec-tls')
                  | TLS
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-con-sec-none(v-model="m.connectionSecurity" type='radio', name='consec', value='none')
                label(for='radio-con-sec-none')
                  | None
          .form-group
            label Send from
            input.form-control(v-model="m.sendFrom" placeholder='sender@yourdomain.com')
          .form-group
            label Send task mail to
            fieldset
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-mail-1(v-model="m.sendTo" type='radio', name='sendTo', value='owners' checked='0')
                label(for='radio-mail-1')
                  | Owners
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-mail-2(v-model="m.sendTo" type='radio', name='sendTo', value='primary-owner' checked='0')
                label(for='radio-mail-2')
                  | Primary owner
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-mail-3(v-model="m.sendTo" type='radio', name='sendTo', value='nobody' checked='1')
                label(for='radio-mail-3')
                  | Nobody
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.ladda-button.btn.btn-primary.pull-right(@click="onSave" data-style="expand-left") Save
          a.ladda-button.btn.btn-warning.pull-right(style="margin-right:10px;" data-style="expand-left") Test

</template>

<script>

import _ from 'lodash'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'MailSettings',
  data () {
    return {
      m: {
        active: 1,
        host: undefined,
        port: 25,
        username: undefined,
        password: undefined,
        sendFrom: undefined,
        sendTo: 'primary-owner',
        connectionSecurity: 'ssl'
      }
    }
  },
  computed: {
    ...mapGetters('settings', [
      'mail',
      'settings'
    ])
  },
  methods: {
    ...mapActions('settings', [
      'create',
      'update'
    ]),
    init () {
      if (this.mail) {
        this.m = _.cloneDeep(this.mail.val)
      }
    },
    close () {
      window.history.back()
    },
    onSave () {
      const name = 'MAIL'
      const value = JSON.stringify(this.m)
      const id = this.m.id
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

