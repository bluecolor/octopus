<template lang="pug">
  section.content
    .row
      .col-md-6.col-md-offset-3  
        .box.box-primary
          .box-header.with-border
            h3.box-title {{title}}
            .box-tools.pull-right
              .has-feedback.table-search
                input.form-control.input-sm.search-box(type='text', placeholder='Search')
          form(role='form')
            el-tabs(v-model="activeNameTab" @tabClick="")
              el-tab-pane(label="Definition", name="definition")
                .box-body
                  .form-group
                    label Name
                    input.form-control(v-model="context.name", type='text', placeholder='')
                  .form-group
                    label Code
                    input.form-control(v-model="context.code", type='text', placeholder='')
                  .form-group
                    label Default context
                    fieldset
                      .radio.radio-inline.radio-danger(style="display:inline")
                        input#radio-default-1(v-model='context.default', type='radio', name='radio-default',value=1)
                        label(for='radio-default-1')
                          | Yes
                      .radio.radio-inline.radio-danger(style="display:inline")
                        input#radio-default-2(v-model='context.default', type='radio', name='radio-default',value=0)
                        label(for='radio-default-2')
                        | No
              el-tab-pane(label="Agents" name="agents")
                .box-body.no-padding(style="min-height: 400px")
                  .table-controls
                    a.btn.btn-default.btn-sm.js-reload-btn(@click='' type='button', data-toggle="tooltip" title="Reload",)
                      i.fa.fa-refresh.text-blue.fa-lg
                  .table-responsive.connection-items
                    table.table.table-hover
                      tbody
                        tr(v-for="m in context.agents")
                          td 
                            router-link(to="/" data-toggle="tooltip" title="Logical agent" ) {{m[0].name}}
                          td
                            select.form-control.selection(v-model='m[1].agentId' data-toggle="tooltip" title="Physical agent")
                              option(v-bind:value=-1) Undefined
                              option(v-for='a in physicalAgents', v-bind:value='a.agentId')
                                | {{ a.name }}
                .box-footer.clearfix
                  ul.pagination.pagination-sm.no-margin.pull-right  
                    el-pagination(@current-change="agentPageChange" layout='prev, pager, next', :total="agentTotal", :page-size="agentPaging.pageSize")                                 
              el-tab-pane(label="Schemas" name="schemas")
                .box-body.no-padding(style="min-height: 400px")
                  .table-controls
                    a.btn.btn-default.btn-sm.js-reload-btn(@click='' type='button', data-toggle="tooltip" title="Reload",)
                      i.fa.fa-refresh.text-blue.fa-lg
                  .table-responsive.connection-items
                    table.table.table-hover
                      tbody
                        tr(v-for="m in schemas")
                          td 
                            router-link(to="/" data-toggle="tooltip" title="Logical schema" ) {{m[0].name}}
                          td 
                            select.form-control.selection(v-model='m[1].internalId' data-toggle="tooltip" title="Physical schema")
                              option(v-bind:value=-1) Undefined
                              option(v-for='s in allPhysicalSchemas', v-bind:value='s.internalId')
                                | {{ s.name }}
                .box-footer.clearfix
                  ul.pagination.pagination-sm.no-margin.pull-right  
                    el-pagination(@current-change="schemaPageChange" layout='prev, pager, next', :total="schemaTotal", :page-size="schemaPaging.pageSize")                                 
              el-tab-pane(label="Version" name="version" v-if="contextId")
                .box-body
                  .form-group
                    label Created by
                    input.form-control(v-model="context.firstUser", type='text', readonly=true)
                  .form-group
                    label Created on
                    input.form-control(v-model="context.firstDateStr", type='text', readonly=true)
                  .form-group
                    label Updated by
                    input.form-control(v-model="context.lastUser", type='text', readonly=true)
                  .form-group
                    label Updated on
                    input.form-control(v-model="context.lastDateStr", type='text', readonly=true)
                  .form-group
                    label Internal ID
                    input.form-control(v-model="context.internalId", type='text', readonly=true)
                  .form-group
                    label Global ID
                    input.form-control(v-model="context.globalId", type='text', readonly=true)
          .box-footer
            a.btn.btn-danger.js-cancel-btn(v-on:click="close") Close
            a.ladda-button.btn.btn-primary.pull-right.js-save-btn(@click="save" data-style="expand-left") Save
</template>

<script>

import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { Tabs, TabPane } from 'element-ui'
import moment from 'moment'

export default {
  name: 'Context',
  props: ['cloneFrom', 'contextId'],
  data () {
    return {
      context: {
        name: '',
        code: '',
        agents: [],
        schemas: [],
        default: 0
      },
      title: 'Context',
      selected: {
        agent: [],
        schema: []
      },
      activeNameTab: 'definition',
      schemaPaging: {
        pageSize: 10,
        currentPage: 1,
        filter: ''
      },
      agentPaging: {
        pageSize: 10,
        currentPage: 1,
        filter: ''
      }
    }
  },
  watch: {
    'context.name' () {
      this.context.code = this.context.name.toUpperCase()
    }
  },
  methods: {
    ...mapActions('arch', [
      'createContext'
    ]),
    schemaPageChange (p) {
      this.schemaPaging.currentPage = p
    },
    agentPageChange (p) {
      this.agentPaging.currentPage = p
    },
    save () {
      if (!this.contextId) {
        this.createContext(this.context)
      }
    },
    close () {
      window.history.back()
    },
    setValues () {
      if (!this.contextId) {
        this.initEmptyContext()
        return
      }
      this.context = _.find(this.contexts, {internalId: parseInt(this.contextId)})
      this.context.firstDateStr = moment.unix(this.context.firstDate / 1000).format('YYYY-MM-DD HH:mm')
      this.context.lastDateStr = moment.unix(this.context.lastDate / 1000).format('YYYY-MM-DD HH:mm')
    },
    initEmptyContext () {
      this.context.agents = _.map(this.logicalAgents, la => [la, {agentId: -1}])
      this.context.schemas = _.map(this.allLogicalSchemas, ls => [ls, {internalId: -1}])
    }
  },
  computed: {
    ...mapGetters('arch', [
      'contexts',
      'allPhysicalSchemas',
      'allLogicalSchemas',
      'physicalAgents',
      'logicalAgents'
    ]),
    schemas () {
      const i = (this.schemaPaging.currentPage - 1) * this.schemaPaging.pageSize
      return _.chain(this.context.schemas).cloneDeep().slice(i, i + this.schemaPaging.pageSize).value()
    },
    agents () {
      const i = (this.agentPaging.currentPage - 1) * this.agentPaging.pageSize
      return _.chain(this.context.agents).cloneDeep().slice(i, i + this.agentPaging.pageSize).value()
    },
    schemaTotal () {
      return this.context.schemas.length
    },
    agentTotal () {
      return this.context.agents.length
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

<style>
  .selection:focus,
  .selection {
    background-color: inherit;
    padding: 0px;
    height: inherit;
    border-color: transparent;
  }


  .selection {
    /*for firefox*/
    -moz-appearance: none;
    /*for chrome*/
    -webkit-appearance:none;
  }

  /*for IE10*/
  .selection::-ms-expand {
    display: none;
  }
  

</style>

