<template lang="pug">
  section.content
    .row
      .col-md-6.col-md-offset-3  
        .box.box-primary
          .box-header.with-border
            h3.box-title {{title}}
          form(role='form')
            el-tabs(v-model="activeNameTab" @tabClick="")
              el-tab-pane(label="Definition", name="definition")
                .box-body
                  .form-group
                    label Name
                    input.form-control(v-model="agent.name", name="name", type='text', v-validate.initial="'required'", placeholder='', required=true, autofocus=true)
                  .form-group
                    label Host
                    input.form-control(v-model="agent.host", name="host", type='text', v-validate.initial="'required'", placeholder='', required=true, autofocus=true)
                  .form-group
                    label Port
                    input.form-control(v-model="agent.port", name="port", type='number', v-validate.initial="'required'", min="1" max="65535")
                  .form-group
                    label Web application context
                    input.form-control(v-model="agent.applicationName", name="applicationName", type='text', placeholder='', v-validate.initial="'required'")
                  .form-group
                    label Protocol
                    input.form-control(v-model="agent.protocol", name="protocol", type='text', placeholder='', v-validate.initial="'required'", required=true, autofocus=true)
              el-tab-pane(label="Load Balancing" name="loadBalancing")
                .table-responsive
                  table.table.table-hover
                    tbody
                      tr(v-for="m in loadBalancingAgents")
                        td(style="width:20px")
                          label.el-checkbox
                            span.el-checkbox__input(:class="selected.indexOf(m.agentId)>-1 ? 'is-checked':''")
                              span.el-checkbox__inner
                              input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.agentId')
                        td 
                          router-link(:to="'physical-agents/' + m.agentId" ) {{m.name}}
                        td {{m.url}}
              el-tab-pane(label="Version" name="version" v-if="id")
                .box-body
                  .form-group
                    label Created by
                    input.form-control(v-model="agent.firstUser", name="firstUser", type='text', readonly=true)
                  .form-group
                    label Created on
                    input.form-control(v-model="agent.firstDateStr", name="firstDate", type='text', readonly=true)
                  .form-group
                    label Updated by
                    input.form-control(v-model="agent.lastUser", name="lastUser", type='text', readonly=true)
                  .form-group
                    label Updated on
                    input.form-control(v-model="agent.lastDateStr", name="lastDate", type='text', readonly=true)
                  .form-group
                    label Internal ID
                    input.form-control(v-model="agent.internalId", name="internalId", type='text', readonly=true)
                  .form-group
                    label Global ID
                    input.form-control(v-model="agent.globalId", name="globalId", type='text', readonly=true)
          .box-footer
            a.btn.btn-danger(v-on:click="close") Close
            a.ladda-button.btn.btn-primary.pull-right(:disabled="hasErrors", @click="save" data-style="expand-left") Save
</template>

<script>

import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { Tabs, TabPane } from 'element-ui'
import moment from 'moment'

export default {
  name: 'PhysicalAgent',
  props: ['id', 'cloneFrom'],
  data () {
    return {
      title: 'Physical Agent',
      activeNameTab: 'definition',
      selected: [],
      agent: {
        name: 'OracleDIAgent',
        agentId: null,
        host: 'localhost',
        port: 20910,
        applicationName: 'oracleidagent',
        protocol: 'http',
        firstUser: null,
        firstDate: null,
        firstDateStr: null,
        lastDateStr: null,
        lastUser: null,
        lastDate: null,
        internalId: null,
        loadBalancingAgents: []
      }
    }
  },
  methods: {
    isLoadBalancingAgent (agnet) {
      return _.find(this.agent.loadBalancingAgents, l => l.agentId === agnet.agentId) !== undefined
    },
    test: function () {
    },
    save: function () {
      this.agent.loadBalancingAgents = this.selected.map(id => { return {agentId: id} })
      if (!this.id) {
        this.createPhysicalAgent(this.agent)
      } else {
        this.updatePhysicalAgent(this.agent)
      }
    },
    close: function () {
      window.history.back()
    },
    ...mapActions('arch', [
      'testPhysicalAgent',
      'createPhysicalAgent',
      'updatePhysicalAgent'
    ]),
    setValues () {
      const i = this.id | this.cloneFrom
      if (!i) {
        return
      }
      this.agent = _.chain(this.physicalAgents).find({agentId: parseInt(i)}).cloneDeep().value()
      this.selected = this.agent.loadBalancingAgents.map(a => a.agentId)
    }
  },
  computed: {
    ...mapGetters('arch', [
      'physicalAgents'
    ]),
    loadBalancingAgents: function () {
      if (!this.id) return this.physicalAgents
      return _.filter(this.physicalAgents, a => a.agentId !== parseInt(this.id))
    },
    hasErrors () {
      return this.errors.all().length > 0
    }
  },
  watch: {
    'agent.firstDate' () {
      this.agent.firstDateStr = moment.unix(this.agent.firstDate / 1000).format('YYYY-MM-DD HH:mm')
    },
    'agent.lastDate' () {
      this.agent.lastDateStr = moment.unix(this.agent.lastDate / 1000).format('YYYY-MM-DD HH:mm')
    }
  },
  mounted () {
    this.setValues()
  },
  components: {
    Tabs,
    TabPane
  }
}
</script>
