<template lang="pug">
.row
  .col-md-6.col-md-offset-3  
    .box.box-primary
      .box-header.with-border
        h3.box-title General Settings
      form(role='form')
        .box-body
          .form-group
            label Parallel task limit
            input.form-control(name="maxParallel" type='number', value=64, max=64)
        .box-body
          .form-group
            label Task check interval (sec.)
            input.form-control(name="taskCheckInterval" type='number', min=20, value=30)
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.ladda-button.btn.btn-primary.pull-right(data-style="expand-left") Save
</template>

<script>
export default {
  name: 'GeneralSettings',
  data () {
    return {}
  },
  methods: {
    close () {
      window.history.back()
    }
  }
}
</script>
