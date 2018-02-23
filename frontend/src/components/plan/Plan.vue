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
              input.form-control(v-model="plan.name" placeholder='Plan name ...', required=true, autofocus=true)
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
            input.form-control(v-model="plan.schedule", placeholder='0 0 12 1/1 * ? *', required=true, autofocus=true)
          .form-group
            label Parallel
            input.form-control(v-model="plan.parallel", type='number', value=10, placeholder='', required=false, min='1')
          .form-group
            label Priority
            div(style="min-width:400px")
              vue-slider(
                ref="slider" 
                v-model="plan.priority" 
                :data="priority"
                piecewise=true
                tooltip="hover" 
                :speed=0.2)
          .form-group
            label Active
            fieldset(:disabled="isNewPlan()")
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-active-1(v-model="plan.active" type='radio', name='radio-active', value='1')
                label(for='radio-active-1')
                  | Yes
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-active-2(v-model="plan.active" type='radio', name='radio-active', value='0', checked='1')
                label(for='radio-active-2')
                  | No
          .form-group
            label Protected
            fieldset
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-protected-1(v-model="plan.protect" type='radio', name='radio-protected', value='1', checked='1')
                label(for='radio-protected-1')
                  | Yes
              .radio.radio-inline.radio-danger(style="display:inline")
                input#radio-protected-2(v-model="plan.protect" type='radio', name='radio-protected', value='0')
                label(for='radio-protected-2')
                  | No
          .form-group
            label Description
            textarea.form-control(v-model="plan.description" rows="3")
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.ladda-button.btn.btn-primary.pull-right(@click="onSave" data-style="expand-left") Save  
</template>

<script>

import _ from 'lodash'
import vueSlider from 'vue-slider-component'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Plan',
  props: ['id'],
  data () {
    return {
      priority: ['Low', 'Medium', 'High', 'Top'],
      plan: {
        priority: 'Medium',
        connection: null,
        active: '0',
        protect: '1',
        parallel: 10
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
  methods: {
    ...mapActions('plans', [
      'create',
      'update',
      'remove'
    ]),
    close () {
      window.history.back()
    },
    isNewPlan () {
      if (this.$route.query.clone === 'true' || !this.id) {
        return true
      }
      return false
    },
    init () {
      if (_.isEmpty(this.id)) {
        return
      }
      const id = parseInt(this.id)
      this.plan = _.chain(this.plans).find({id}).cloneDeep().value()
      this.plan.active = this.plan.active ? '1' : '0'
      this.plan.protect = this.plan.protect ? '1' : '0'
      if (this.plan) {
        this.plan.connection = this.plan.connection ? this.plan.connection.id : undefined
        this.plan.priority = this.priority[Math.max(this.plan.priority, 1) - 1]
      }
    },
    onSave () {
      this.plan.priority = this.$refs.slider.getIndex() + 1
      this.plan.active = this.plan.active === '1'
      this.plan.protect = this.plan.protect === '1'
      if (this.$route.query.clone === 'true') {
        this.plan.id = undefined
        this.create(this.plan)
      } else if (this.plan.id) {
        this.update(this.plan)
      } else {
        this.create(this.plan)
      }
    }
  },
  mounted () {
    this.init()
  },
  components: {
    vueSlider
  }
}

</script>

<style lang="scss" scoped>
.input-group-addon {
  line-height: 1.28;
  border-bottom-right-radius: 3px;
  border-top-right-radius: 3px;
}
</style>
