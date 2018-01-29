<template lang="pug">
.row
  .col-md-6.col-md-offset-3  
    .box.box-primary
      .box-header.with-border
        h3.box-title User
      .panel-body(style="height:400px")  
        form(name="connection-form", role='form')
          .box-body
            .form-group
              label Username
              input.form-control(v-model="user.username" required=true, autofocus=true)
            .form-group
              label Name
              input.form-control(v-model="user.name",  required=true)
            .form-group
              label Email
              input.form-control(v-model="user.email", required=true)
            .form-group
              label Role
              select.form-control(v-model="user.role")
                option(value="GUEST")     GUEST
                option(value="OPERATOR")  OPERATOR
                option(value="MASTER")    MASTER
            .form-group
              label Locked
              fieldset
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#user-locked-1(v-model="user.locked", type='radio', name='locked', value='1')
                  label(for='radio1')
                    | Yes
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#user-locked-2(v-model="user.locked" type='radio', name='locked', value='0', checked='1')
                  label(for='radio4')
                    | No    
      .box-footer
        a.btn.btn-danger(@click="close") Close
        a.ladda-button.btn.btn-primary.pull-right(@click="onSave" data-style="expand-left") Save  
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'User',
  props: ['id'],
  data () {
    return {
      user: {
        locked: 0,
        role: 'GUEST'
      }
    }
  },
  methods: {
    ...mapActions('users', [
      'saveUser'
    ]),
    close () {
      window.history.back()
    },
    onSave () {
      this.user.locked = this.user.locked === '1'
      this.saveUser(this.user)
    },
    init () {
      if (_.isEmpty(this.id)) {
        return
      }
      const id = parseInt(this.id)
      this.user = _.find(this.users, {id})
      this.user.locked = this.user.locked ? 1 : 0
    }
  },
  computed: {
    ...mapGetters('users', [
      'users'
    ])
  },
  mounted () {
    this.init()
  }

}
</script>
