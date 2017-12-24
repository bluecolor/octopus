<template lang="pug">
  section.content
    .row
      .col-md-6.col-md-offset-3  
        .box.box-primary
          .box-header.with-border
            h3.box-title Connection
          form(role='form')
            .box-body
              .form-group
                label Name
                input.form-control(v-model="connection.name", name="name", type='text', placeholder='', required=true, autofocus=true)
              .form-group
                label Type
                select.form-control(v-model="connection.connectionType")
                  option(value="SSH")   SSH
                  option(value="JDBC")  JDBC - Database
                  option(value="LOCAL") Local
              section(v-show="connection.connectionType === 'JDBC'")
                .form-group
                  label JDBC URL
                  input.form-control(placeholder='e.g. jdbc:postgresql://host:port/database')
                .form-group
                  label Username
                  input.form-control(placeholder='Username ...')
                .form-group
                  label Password
                  input.form-control(type='password' placeholder='Password ...')
              section(v-show="connection.connectionType === 'SSH'")
                .row
                  div.col-xs-9
                    .form-group
                      label Host
                      input.form-control(placeholder='Host or IP Address')
                  div.col-xs-3
                    .form-group
                      label Port
                      input.form-control(type='number' value="22" min="1" max="65535")
                .form-group
                  label Username
                  input.form-control(placeholder='Username ...')
                .form-group
                  label Password
                  input.form-control(type='password' placeholder='Password ...')          
          .box-footer
            a.btn.btn-danger.js-cancel-btn(v-on:click="close") Close
            a.ladda-button.btn.btn-primary.pull-right(:disabled="!isValid" @click="save" data-style="expand-left") Save
            a.ladda-button.btn.btn-warning.pull-right(:disabled="!isValid" data-style="expand-left" style="margin-right:10px;" @click="testConnection(connection)") Test
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Connection',
  props: ['id', 'cloneFrom'],
  data () {
    return {
      connection: {
        id: null,
        name: null,
        disabled: false,
        connectionType: 'SSH',
        host: '',
        port: '',
        jdbcUrl: '',
        username: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapGetters('connections', [
      'connections'
    ]),
    save () {
      this.saveConnection(this.connection)
    },
    close: function () {
      window.history.back()
    },
    ...mapActions('connections', [
      'saveConnection',
      'testConnection'
    ]),
    setValues () {
    }
  },
  computed: {
    isValid () {
    }
  },
  mounted () {
    this.setValues()
  }
}
</script>
