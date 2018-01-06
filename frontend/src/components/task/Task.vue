<template lang="pug">
.row
  .col-md-6.col-md-offset-3  
    .box.box-primary
      .box-header.with-border
        h3.box-title {{title}}
      .panel-body(style="height:620px")
        ul.nav.nav-tabs
          li.active
            a(href='#task-general', data-toggle='tab', aria-expanded='true') General
          li
            a(href='#task-script', data-toggle='tab', aria-expanded='false') Script
          li
            a(href='#task-dependencies', data-toggle='tab', aria-expanded='false') Dependencies
          li
            a(href='#task-groups', data-toggle='tab', aria-expanded='false') Groups
          li
            a(href='#task-owners', data-toggle='tab', aria-expanded='false') Owners
        .tab-content
          #task-general.tab-pane.active.in(style="margin:10px")
            .box-body
              .form-group
                label Name
                input.form-control(placeholder='Task name ...', required=true, autofocus=true)
              .form-group
                label Connection
                .input-group
                  select.form-control(v-model="task.connection")
                    option(v-for="m in connections" :value="m.id")  {{m.name}}
                  router-link.btn.btn-default.input-group-addon(to="/connection")
                    span.fa.text-success.fa-plus    
              .form-group
                label Plan
                .input-group
                  select.form-control(v-model="task.plan")
                    option(v-for="m in plans" :value="m.id")  {{m.name}}
                  router-link.btn.btn-default.input-group-addon(to="/plan")
                    span.fa.text-success.fa-plus    
              .form-group
                label Retry Count
                input.form-control(value=0 type='number' required=false, min='0')
              .form-group
                label Priority
                div(style="min-width:400px")
                  vue-slider(
                    ref="slider" 
                    v-model="task.priority" 
                    :data=['Low', 'Medium', 'High', 'Top']
                    piecewise=true 
                    tooltip="hover" 
                    :speed=0.2)
              .form-group
                  label Active
                  fieldset
                    .radio.radio-inline.radio-danger(style="display:inline")
                      input#radio-active-1(type='radio', name='radio-active', value='1',checked='1')
                      label(for='radio1')
                        | Yes
                    .radio.radio-inline.radio-danger(style="display:inline")
                      input#radio-active-2(type='radio', name='radio-active', value='0')
                      label(for='radio2')
                        | No
              .form-group
                label Description
                textarea.form-control(rows='3')
          #task-script.tab-pane(style="margin:10px")
          #task-dependencies.tab-pane(style="margin:10px")
          #task-groups.tab-pane(style="margin:10px")
          #task-owners.tab-pane(style="margin:10px")
      .box-footer
        a.btn.btn-danger Close
        a.disabled.ladda-button.btn.btn-primary.pull-right(data-style="expand-left") Save
</template>

<script>
import {mapGetters} from 'vuex'
import vueSlider from 'vue-slider-component'

export default {
  props: ['id'],
  data () {
    return {
      title: 'Task',
      task: {
        priority: 0,
        connection: null,
        plan: null
      }
    }
  },
  computed: {
    ...mapGetters('connections', [
      'connections'
    ]),
    ...mapGetters('plans', [
      'plans'
    ])
  },
  components: {
    vueSlider
  }
}
</script>

<style lang="scss" scoped>
.input-group-addon {
  line-height: 1.56;
}
</style>
