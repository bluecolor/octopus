<template lang="pug">
section.content
  .row
    .col-md-6.col-md-offset-3
      .box.box-primary
        .box-header.with-border
          i.fa.fa-envelope.fa-2x.text-gray-harbor
          h3.box-title {{title}}
        form(role='form')
          .box-body
            .form-group
              label Mail service active
              fieldset
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#radio-service-1(v-model="mail.active" type='radio' name='active', value='yes')
                  label(for='radio-service-1')
                    | Yes
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#radio-service-2(v-model="mail.active" type='radio' name='active', value='no')
                  label(for='radio-service-2')
                    | No
            .row
              div.col-xs-9
                .form-group
                  label Host
                  input.form-control(v-validate.initial="'required'" v-model="mail.host" placeholder='Host or IP Address')
              div.col-xs-3
                .form-group
                  label Port
                  input.form-control(v-model="mail.port" type='number' value="25" min="1" max="65535")
            .form-group
              label Username
              input.form-control(v-model="mail.username" placeholder='Username')
            .form-group
              label Password
              input.form-control(v-model="mail.password" type='password' placeholder='Password')  
            .form-group
              label Connection security
              fieldset
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#radio-con-sec-ssl(v-model="mail.security" type='radio', name='security', value='ssl')
                  label(for='radio-con-sec-ssl')
                    | SSL
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#radio-con-sec-tls(v-model="mail.security" type='radio' name='security', value='tls')
                  label(for='radio-con-sec-tls')
                    | TLS
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#radio-con-sec-none(v-model="mail.security" type='radio', name='security', value='none')
                  label(for='radio-con-sec-none')
                    | None
            .form-group
              label Send from
              input.form-control(v-model="mail.sendFrom" v-validate="'email'" placeholder='sender@yourdomain.com')  
            .form-group
              label Send mail to
              fieldset
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#radio-mail-1(v-model="mail.sendTo" type='radio', name='sendTo', value='creating')
                  label(for='radio-mail-1')
                    | Creating User 
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#radio-mail-2(v-model="mail.sendTo" type='radio', name='sendTo', value='modifying')
                  label(for='radio-mail-2')
                    | Modifying User
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#radio-mail-3(v-model="mail.sendTo" type='radio', name='sendTo', value='all')
                  label(for='radio-mail-3')
                    | Creating & Modifying
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#radio-mail-4(v-model="mail.sendTo" type='radio', name='sendTo', value='none')
                  label(for='radio-mail-4')
                    | Nobody 
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.ladda-button.btn.btn-primary.pull-right(@click="save" :disabled="hasErrors" data-style="expand-left") Save       

</template>
<script>

  import _ from 'lodash'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'Configuration',
    data () {
      return {
        title: 'Mail',
        mail: {
          host: '',
          active: 'yes',
          sendTo: 'all',
          security: 'none',
          port: 493
        }
      }
    },
    methods: {
      ...mapActions('settings', [
        'saveSettings'
      ]),
      close () {
        window.history.back()
      },
      save () {
        this.saveSettings({name: 'MAIL', value: JSON.stringify(this.mail)})
      },
      setValues () {
        this.mail = _.cloneDeep(this.mailSettings)
      }
    },
    computed: {
      ...mapGetters('settings', [
        'mailSettings'
      ]),
      hasErrors () {
        false
      }
    },
    mounted () {
      this.setValues()
    }
  }
</script>

<style>
</style>
