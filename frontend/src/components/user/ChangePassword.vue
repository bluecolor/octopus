<template lang="pug">
.row
  .col-md-6.col-md-offset-3
    .box.box-primary
      .box-header.with-border
        h3.box-title {{title}}
      form(role='form')
        .box-body
          .form-group
            label Current password
            input.form-control(v-model="password.currentp" required=true, autofocus=true)
          .form-group
            label New password
            input.form-control(v-model="password.newp" type="password" required=true)
          .form-group
            label Retype new password
            input.form-control(:class="password.newp !== password.renewp ? 'no-match' : ''" v-model="password.renewp" type="password" required=true)
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.btn.btn-primary.pull-right(:class="isValid?'':'disabled'" @click="onSave" data-style="expand-left") Save

</template>

<script>

// import _ from 'lodash'
import {mapActions} from 'vuex'

export default {
  name: 'ChangePassword',
  props: ['id'],
  data () {
    return {
      title: 'Change password',
      password: {
        currentp: undefined,
        newp: undefined,
        renewp: undefined
      }
    }
  },
  methods: {
    ...mapActions('users', [
      'changePassword'
    ]),
    close () {
      window.history.back()
    },
    onSave () {
      this.changePassword({o: this.password.currentp, n: this.password.newp})
    }
  },
  computed: {
    isValid () {
      return (
        this.password.currentp &&
        this.password.newp &&
        this.password.renewp &&
        this.password.newp === this.password.renewp
      )
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

.no-match {
  color: red !important;
}

</style>

