<template lang="pug">
  section.content
    el-dialog(title='Test Connection', :visible.sync='testOptions.dialogVisible', size='tiny')
      el-form(:model='testOptions.data')
        el-form-item.agent(label='Agent' label-width='72px')
          el-select(v-model='testOptions.data.agent', placeholder='Please select an agent')
            el-option(label="No Agent" key="", value='')
            el-option(v-for="m in physicalAgents", :label="m.name" :key="m.agentId", :value='m.agentId')
      span.dialog-footer(slot='footer')
        el-button(@click='testOptions.dialogVisible = false') Cancel
        el-button(type='primary', @click='testConnection') Test
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
                    label Technology
                    input.form-control(v-model="technology.name", type='text', disabled=true)
                  .form-group
                    label Name
                    input.form-control(v-model="dataServer.name", type='text', placeholder='')
                  .form-group
                    label Instance / Dblink
                    input.form-control(v-model="dataServer.instance", type='text', placeholder='')
                  .form-group
                    label Username
                    input.form-control(v-model="dataServer.username", type='text', placeholder='')
                  .form-group
                    label Password
                    input.form-control(v-model="dataServer.password", type='password', placeholder='')
                  .form-group
                    label Array fetch size
                    input.form-control(v-model="dataServer.fetchArraySize", type='number')
                  .form-group
                    label Batch update size
                    input.form-control(v-model="dataServer.batchUpdateSize", type='number')
              el-tab-pane(label="JDBC" name="jdbc")
                .box-body
                  .form-group
                    label Url
                    input.form-control(v-model="dataServer.connectionSettings.jdbcUrl", type='text', placeholder='')
                  .form-group
                    label Class name
                    input.form-control(v-model="dataServer.connectionSettings.driverClass", type='text', placeholder='')
              el-tab-pane(label="Physical Schemas" name="physicalSchemas" v-if="dataServerId")
                .box-body.no-padding(style="min-height: 400px")
                  .table-controls
                    a.btn.btn-default.btn-sm.js-reload-btn(@click='' type='button', data-toggle="tooltip" title="Reload",)
                      i.fa.fa-refresh.text-blue.fa-lg
                    router-link.js-item.btn.btn-default.btn-sm(:to="dataServerId + '/physical-schema'" ,data-toggle="tooltip" title="New",)
                      i.fa.fa-plus.text-green.fa-lg
                    a.btn.btn-default.btn-sm(@click="", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
                      i.fa.fa-trash-o.text-danger.fa-lg
                  .table-responsive.connection-items
                    table.table.table-hover
                      tbody
                        tr(v-for="m in dataServer.physicalSchemas")
                          td(style="width:20px")
                            label.el-checkbox
                              span.el-checkbox__input(:class="selected.indexOf(m.internalId)>-1 ? 'is-checked':''")
                                span.el-checkbox__inner
                                input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.internalId')
                          td 
                            router-link(:to="dataServerId + '/physical-schema/' + m.internalId" ) {{m.name}}
                          td(align="center")
                            router-link(:to="'physical-technology/' + m.internalId" data-toggle="tooltip" title="Details")
                              i.fa.text-gray-harbor.fa-database                              
              el-tab-pane(label="Version" name="version" v-if="dataServerId")
                .box-body
                  .form-group
                    label Created by
                    input.form-control(v-model="dataServer.firstUser", type='text', readonly=true)
                  .form-group
                    label Created on
                    input.form-control(v-model="dataServer.firstDateStr", type='text', readonly=true)
                  .form-group
                    label Updated by
                    input.form-control(v-model="dataServer.lastUser", type='text', readonly=true)
                  .form-group
                    label Updated on
                    input.form-control(v-model="dataServer.lastDateStr", type='text', readonly=true)
                  .form-group
                    label Internal ID
                    input.form-control(v-model="dataServer.internalId", type='text', readonly=true)
                  .form-group
                    label Global ID
                    input.form-control(v-model="dataServer.globalId", type='text', readonly=true)
          .box-footer
            a.btn.btn-danger.js-cancel-btn(v-on:click="close") Close
            a.js-item.ladda-button.btn.btn-primary.pull-right.js-save-btn(@click="save(dataServer)" data-style="expand-left") Save
            a.ladda-button.btn.btn-warning.pull-right.js-test-btn(v-show="false" data-style="expand-left" style="margin-right:10px;" @click="test") Test
</template>

<script>

import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { Tabs, TabPane } from 'element-ui'
import moment from 'moment'

export default {
  name: 'DataServer',
  props: ['cloneFrom', 'dataServerId', 'technologyId'],
  data () {
    return {
      dataServer: {
        name: '',
        connectionSettings: {}
      },
      testOptions: {
        dialogVisible: false,
        data: {
          agent: ''
        }
      },
      title: 'Data Server',
      selected: [],
      activeNameTab: 'definition'
    }
  },
  watch: {
  },
  methods: {
    ...mapActions('arch', [
      'createDataServer',
      'updateDataServer'
    ]),
    save: function () {
      const payload = {
        technologyId: this.technologyId,
        dataServer: this.dataServer
      }
      if (!this.dataServerId) {
        this.createDataServer(payload)
      } else {
        this.updateDataServer(payload)
      }
    },
    close: function () {
      window.history.back()
    },
    test () {
      this.testOptions.dialogVisible = true
    },
    testConnection () {
      this.testOptions.dialogVisible = false
      this.testDataServer(this.dataServerId, this.testOptions.data.agent)
    },
    setValues () {
      const dataServers = this.dataServers(this.technologyId)
      if (!this.dataServerId) {
        return
      }
      this.dataServer = _.chain(dataServers).find({internalId: parseInt(this.dataServerId)}).cloneDeep().value()
      this.dataServer.firstDateStr = moment.unix(this.dataServer.firstDate / 1000).format('YYYY-MM-DD HH:mm')
      this.dataServer.lastDateStr = moment.unix(this.dataServer.lastDate / 1000).format('YYYY-MM-DD HH:mm')
    }
  },
  computed: {
    ...mapGetters('arch', [
      'dataServers',
      'physicalAgents',
      'technologies'
    ]),
    technology () {
      return _.find(this.technologies, {internalId: parseInt(this.technologyId)})
    },
    physicalSchemas () {
      if (!this.dataServerId) {
        return
      }
      const dataServers = this.dataServers(this.technologyId)
      return _.find(dataServers, {internalId: parseInt(this.dataServerId)}).physicalSchemas
    }
  },
  created () {
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
