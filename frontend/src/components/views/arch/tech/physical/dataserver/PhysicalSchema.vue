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
                    input.form-control(v-model="ps.name", type='text', placeholder='', disabled=true, autofocus=true)
                  .form-group
                    label Schema
                    input.form-control(v-model="ps.schemaName", type='text', placeholder='', required=true, autofocus=true)
                  .form-group
                    label Work schema
                    input.form-control(v-model="ps.workSchemaName", type='text', placeholder='', required=true, autofocus=true)
              el-tab-pane(label="Prefixes" name="prefixes")
                .box-body
                  .form-group
                    label Error table prefix
                    input.form-control(v-model="ps.errorPrefix", type='text')
                  .form-group
                    label Loading table prefix
                    input.form-control(v-model="ps.loadingPrefix", type='text')
                  .form-group
                    label Integration table prefix
                    input.form-control(v-model="ps.integrationPrefix", type='text')
                  .form-group
                    label Temporary index prefix
                    input.form-control(v-model="ps.tempIndexPrefix", type='text')  
              el-tab-pane(label="Version" name="version" v-if="physicalSchemaId")
                .box-body
                  .form-group
                    label Created by
                    input.form-control(v-model="ps.firstUser", name="firstUser", type='text', readonly=true)
                  .form-group
                    label Created on
                    input.form-control(v-model="ps.firstDateStr", name="firstDate", type='text', readonly=true)
                  .form-group
                    label Updated by
                    input.form-control(v-model="ps.lastUser", name="lastUser", type='text', readonly=true)
                  .form-group
                    label Updated on
                    input.form-control(v-model="ps.lastDateStr", name="lastDate", type='text', readonly=true)
                  .form-group
                    label Internal ID
                    input.form-control(v-model="ps.internalId", name="internalId", type='text', readonly=true)
                  .form-group
                    label Global ID
                    input.form-control(v-model="ps.globalId", name="globalId", type='text', readonly=true)
          .box-footer
            a.btn.btn-danger(v-on:click="close") Close
            a.ladda-button.btn.btn-primary.pull-right(@click="save" data-style="expand-left") Save
</template>

<script>

import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { Tabs, TabPane } from 'element-ui'
import moment from 'moment'

export default {
  name: 'PhysicalSchema',
  props: ['technologyId', 'dataServerId', 'physicalSchemaId', 'cloneFrom'],
  data () {
    return {
      title: 'Physical Schema',
      selected: [],
      activeNameTab: 'definition',
      dataServer: {},
      ps: {
        name: '',
        schemaName: '',
        workSchemaName: '',
        errorPrefix: 'E$_',
        loadingPrefix: 'C$_',
        integrationPrefix: 'I$_',
        tempIndexPrefix: 'IX$_'
      }
    }
  },
  watch: {
    'ps.schemaName' () {
      this.ps.name = `${this.dataServer.name}.${this.ps.schemaName}`
    }
  },
  methods: {
    save () {
      const payload = {
        dataServerId: this.dataServerId,
        data: this.ps
      }
      if (!this.physicalSchemaId) {
        this.createPhysicalSchema(payload)
      }
    },
    test () {
    },
    close () {
      window.history.back()
    },
    ...mapActions('arch', [
      'createPhysicalSchema'
    ]),
    setValues () {
      if (this.physicalSchemaId) {
        this.ps = this.physicalSchema(this.technologyId, this.dataServerId, this.physicalSchemaId)
        this.ps.firstDateStr = moment.unix(this.ps.firstDate / 1000).format('YYYY-MM-DD HH:mm')
        this.ps.lastDateStr = moment.unix(this.ps.lastDate / 1000).format('YYYY-MM-DD HH:mm')
      }
      this.dataServer = _.find(this.dataServers(parseInt(this.technologyId)), {internalId: parseInt(this.dataServerId)})
    }
  },
  computed: {
    ...mapGetters('arch', [
      'physicalSchema',
      'dataServers'
    ])
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
