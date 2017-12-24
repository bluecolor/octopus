<template lang="pug">
  section.content
    .row
      .col-md-6.col-md-offset-3  
        .box.box-primary
          .box-header.with-border
            h3.box-title Technology
          form(role='form')
            el-tabs(v-model="activeNameTab" @tabClick="")
              el-tab-pane(label="Definition", name="definition")
                .box-body
                  .form-group
                    label Name
                    input.form-control(v-model="technology.name", name="name", type='text', placeholder='', disabled=true)
                  .form-group
                    label Code
                    input.form-control(v-model="technology.code", name="host", type='text', placeholder='', disabled=true)
                  .form-group
                    router-link(:to="'physical-technology/' " data-toggle="tooltip" title="Details") Data servers
              el-tab-pane(label="Version" name="version" v-if="id")
                .box-body
                  .form-group
                    label Created by
                    input.form-control(v-model="technology.firstUser", name="firstUser", type='text', readonly=true)
                  .form-group
                    label Created on
                    input.form-control(v-model="technology.firstDateStr", name="firstDate", type='text', readonly=true)
                  .form-group
                    label Updated by
                    input.form-control(v-model="technology.lastUser", name="lastUser", type='text', readonly=true)
                  .form-group
                    label Updated on
                    input.form-control(v-model="technology.lastDateStr", name="lastDate", type='text', readonly=true)
                  .form-group
                    label Internal ID
                    input.form-control(v-model="technology.internalId", name="internalId", type='text', readonly=true)
                  .form-group
                    label Global ID
                    input.form-control(v-model="technology.globalId", name="globalId", type='text', readonly=true)
          .box-footer
            a.btn.btn-danger.js-cancel-btn(v-on:click="close") Close
</template>

<script>

import _ from 'lodash'
import { mapGetters } from 'vuex'
import { Tabs, TabPane } from 'element-ui'
import moment from 'moment'

export default {
  name: 'PhysicalTechnology',
  props: ['id'],
  data () {
    return {
      selected: [],
      activeNameTab: 'definition'
    }
  },
  methods: {
    close: function () {
      window.history.back()
    }
  },
  computed: {
    ...mapGetters('arch', [
      'technologies'
    ]),
    technology: function () {
      const i = this.id
      let d = {
        name: '',
        code: '',
        firstUser: null,
        firstDate: null,
        lastUser: null,
        lastDate: null,
        internalId: null
      }
      if (i) {
        const id = parseInt(i)
        const tech = _.find(this.technologies, {internalId: id})
        if (tech) {
          if (this.id) {
            tech.firstDateStr = moment.unix(tech.firstDate / 1000).format('YYYY-MM-DD HH:mm')
            tech.lastDateStr = moment.unix(tech.lastDate / 1000).format('YYYY-MM-DD HH:mm')
          }
          tech.code = tech.name.toUpperCase()
          return tech
        }
      }
      return d
    }
  },
  mounted () {
  },
  components: {
    Tabs,
    TabPane
  }
}
</script>
