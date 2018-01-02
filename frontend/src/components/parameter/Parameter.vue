<template lang="pug">
.row
  .col-md-6.col-md-offset-3  
    .box.box-primary
      .box-header.with-border
        h3.box-title {{title}}
      form(role='form')
        .box-body
          .form-group
            label Name
            input.form-control(required=true, autofocus=true)
          .form-group
            label Value
            input.form-control(required=true, autofocus=true)
          .form-group
            label Description
            textarea.form-control(name="description" rows="6")
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.disabled.ladda-button.btn.btn-primary.pull-right(data-style="expand-left") Save
          
</template>

<script>
export default {
  name: 'Parameter',
  props: ['id'],
  data () {
    return {title: 'Parameter'}
  },
  methods: {
    close () {
      window.history.back()
    }
  }
}
</script>
