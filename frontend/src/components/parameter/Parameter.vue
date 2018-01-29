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
            input.form-control(v-model="parameter.name" required=true, autofocus=true)
          .form-group
            label Value
            input.form-control(v-model="parameter.value" required=true, autofocus=true)
          .form-group
            label Description
            textarea.form-control(v-model="parameter.description" rows="6")
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.ladda-button.btn.btn-primary.pull-right(@click="onSave" data-style="expand-left") Save
          
</template>

<script>

import _ from 'lodash'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'Parameter',
  props: ['id'],
  data () {
    return {
      title: 'Parameter',
      parameter: {}
    }
  },
  methods: {
    ...mapActions('parameters', [
      'create',
      'update',
      'remove'
    ]),
    close () {
      window.history.back()
    },
    init () {
      if (_.isEmpty(this.id)) {
        return
      }
      const id = parseInt(this.id)
      this.parameter = _.find(this.parameters, {id})
    },
    onSave () {
      if (this.$route.query.clone === 'true') {
        this.parameter.id = undefined
        this.create(this.parameter)
      } else if (this.parameter.id) {
        this.update(this.parameter)
      } else {
        this.create(this.parameter)
      }
    }
  },
  computed: {
    ...mapGetters('parameters', [
      'parameters'
    ])
  },
  mounted () {
    this.init()
  }
}
</script>
