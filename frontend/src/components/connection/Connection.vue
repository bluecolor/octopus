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
                  input.form-control(v-model="connection.jdbcUrl" placeholder='e.g. jdbc:postgresql://host:port/database')
                .form-group
                  label Username
                  input.form-control(v-model="connection.username" placeholder='Username ...')
                .form-group
                  label Password
                  input.form-control(v-model="connection.password" type='password' placeholder='Password ...')
              section(v-show="connection.connectionType === 'SSH'")
                .row
                  div.col-xs-9
                    .form-group
                      label Host
                      input.form-control(v-model="connection.host" placeholder='Host or IP Address')
                  div.col-xs-3
                    .form-group
                      label Port
                      input.form-control(v-model="connection.port" type='number' value="22" min="1" max="65535")
                .form-group
                  label Username
                  input.form-control(v-model="connection.username" placeholder='Username ...')
                .form-group
                  label Password
                  input.form-control(v-model="connection.password" type='password' placeholder='Password ...')          
          .box-footer
            a.btn.btn-danger.js-cancel-btn(v-on:click="close") Close
            a.ladda-button.btn.btn-primary.pull-right(:class="isValid ? '':'disabled'" @click="save" data-style="expand-left") Save
            a.ladda-button.btn.btn-warning.pull-right(:class="isValid ? '':'disabled'" data-style="expand-left" style="margin-right:10px;" @click="testConnection(connection)") Test
</template>

<script>

import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Connection',
  props: ['id'],
  data () {
    return {
      connection: {
        id: undefined,
        name: undefined,
        disabled: false,
        connectionType: 'SSH',
        host: undefined,
        port: undefined,
        jdbcUrl: undefined,
        username: undefined,
        password: undefined
      }
    }
  },
  methods: {
    save () {
      this.saveConnection(this.connection)
    },
    close: function () {
      window.history.back()
    },
    ...mapActions('connections', {
      saveConnection: 'save',
      testConnection: 'test'
    }),
    setValues () {
      if (!_.isEmpty(this.id)) {
        const id = parseInt(this.id)
        this.connection = _.chain(this.connections).find({id}).cloneDeep().value()
      }
      if (this.$route.query.clone === 'true') {
        this.connection.id = undefined
      }
    }
  },
  computed: {
    ...mapGetters('connections', [
      'connections'
    ]),
    isValid () {
      if (_.isEmpty(this.connection.name)) { return false }
      switch (this.connection.connectionType) {
        case 'SSH': return (
          this.connection.host &&
          this.connection.port &&
          this.connection.username &&
          this.connection.password
        )
        case 'JDBC': return (
          this.connection.jdbcUrl &&
          this.connection.username &&
          this.connection.password
        )
      }
      return true
    }
  },
  mounted () {
    this.setValues()
  }
}
</script>
