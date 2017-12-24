<template lang="pug">
  section.content
    .row
      .col-md-6.col-md-offset-3  
        .box.box-primary
          .box-header.with-border
            h3.box-title {{title}}
          form(role='form')
            .box-body
              .form-group
                label Name
                input.form-control(v-model="user.name", v-validate.initial="'required'", name="name", type='text', required=true, autofocus=true)
              .form-group
                label Username
                input.form-control(v-model="user.username", v-validate.initial="'required'", name="username", type='text',  required=true)
              .form-group
                label Email
                input.form-control(v-model='user.email', v-validate.initial="'required|email'", name="email", type='text')
              .form-group
                label Role
                select.form-control(v-model="user.role")
                  option(value="OPERATOR")  OPERATOR
                  option(value="MASTER")    MASTER
              .form-group
                label Locked
                fieldset
                  .radio.radio-inline.radio-danger(style="display:inline")
                    input#radio-locked-1(v-model='user.locked', type='radio', name='radio-locked',value=1)
                    label(for='radio-locked-1')
                      | Yes
                  .radio.radio-inline.radio-danger(style="display:inline")
                    input#radio-locked-2(v-model='user.locked', type='radio', name='radio-locked',value=0)
                    label(for='radio-locked-2')
                    | No
          .box-footer
            a.btn.btn-danger.js-cancel-btn(v-on:click="close") Close
            a.ladda-button.btn.btn-primary.pull-right.js-save-btn(:disabled="hasErrors" @click="saveUser(user)" data-style="expand-left") Save
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'User',
  props: ['id'],
  data () {
    return {
      title: 'User',
      user: {
        name: null,
        username: null,
        email: '',
        role: 'OPERATOR',
        locked: 0
      }
    }
  },
  methods: {
    close: function () {
      window.history.back()
    },
    ...mapActions('users', [
      'saveUser'
    ]),
    setValues () {
      if (_.isEmpty(this.id)) {
        return
      }
      this.user = _.find(this.users, {id: parseInt(this.id)})
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters('users', [
      'users'
    ]),
    hasErrors () {
      return this.errors.all().length > 0
    }
  },
  mounted () {
    this.setValues()
  },
  components: {
  }
}
</script>
