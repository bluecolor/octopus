<template lang="pug">
.row
  .col-md-6.col-md-offset-3  
    .box.box-primary
      .box-header.with-border
        h3.box-title Plan
      form(name="plan-form", role='form')
        .box-body
          .form-group
            label Name
            .input-group
              input.form-control(name="name", type='text', placeholder='Plan name ...', required=true, autofocus=true)
              router-link.btn.btn-default.input-group-addon(:to='"/tasks?plan="+id') Tasks
          .form-group
            label Connection
            .input-group
              select.form-control(v-model="plan.connection")
                option(v-for="m in connections" :value="m.id")  {{m.name}}
              router-link.btn.btn-default.input-group-addon(to="/connection")
                span.fa.text-success.fa-plus
          .form-group
            label Schedule
            input.form-control(name="schedule", type='text', placeholder='0 0 12 1/1 * ? *', required=true, autofocus=true)
          .form-group
            label Parallel
            input.form-control(name="parallel", type='number', value=10, placeholder='', required=false, min='1')
          .form-group
            label Priority
            div(style="min-width:400px")
              vue-slider(
                ref="slider" 
                v-model="plan.priority" 
                :data=['Low', 'Medium', 'High', 'Top']
                piecewise=true 
                tooltip="hover" 
                :speed=0.2)
          .form-group
            label Active
            fieldset(disabled="disabled")
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-active-1(type='radio', name='radio-active', value='1')
                label(for='radio-active-1')
                  | Yes
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-active-2(type='radio', name='radio-active', value='0', checked='1')
                label(for='radio-active-2')
                  | No
          .form-group
            label Protected
            fieldset
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-protected-1(type='radio', name='radio-protected', value='1', checked='1')
                label(for='radio-protected-1')
                  | Yes
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-protected-2(type='radio', name='radio-protected', value='0')
                label(for='radio-protected-2')
                  | No
          .form-group
            label Description
            textarea.form-control(name="description" rows="3")
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.disabled.ladda-button.btn.btn-primary.pull-right(data-style="expand-left") Save  
</template>

<script>
import vueSlider from 'vue-slider-component'
import {mapGetters} from 'vuex'

export default {
  name: 'Plan',
  props: ['id'],
  data () {
    return {
      plan: {
        priority: 1,
        connection: null
      }
    }
  },
  computed: {
    ...mapGetters('connections', [
      'connections'
    ])
  },
  methods: {
    close () {
      window.history.back()
    }
  },
  components: {
    vueSlider
  }
}
</script>

<style lang="scss" scoped>
.input-group-addon {
  line-height: 1.28;
}
</style>
