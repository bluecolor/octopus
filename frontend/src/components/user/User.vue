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
              input.form-control(name="username", type='text', required=true, autofocus=true)
            .form-group
              label Name
              input.form-control(name="name", type='text',  required=true)
            .form-group
              label Email
              input.form-control(name="email", type='text', required=true)
            .form-group
              label Role
              select.form-control(name="role")
                option(value="GUEST")     GUEST
                option(value="OPERATOR")  OPERATOR
                option(value="MASTER")    MASTER
            .form-group
              label Locked
              fieldset
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#user-locked-1(type='radio', name='locked', value='1')
                  label(for='radio1')
                    | Yes
                .radio.radio-inline.radio-danger(style="display:inline")
                  input#user-locked-2(type='radio', name='locked', value='0', checked='1')
                  label(for='radio4')
                    | No    
      .box-footer
        a.btn.btn-danger(@click="close") Close
        a.disabled.ladda-button.btn.btn-primary.pull-right(data-style="expand-left") Save  
</template>

<script>
export default {

  name: 'User',
  props: ['id'],
  date () {
    return {}
  },
  methods: {
    close () {
      window.history.back()
    }
  }

}
</script>
