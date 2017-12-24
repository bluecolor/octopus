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
                    input.form-control(v-model="loadPlan.name", type='text', placeholder='')
                  .form-group
                    label Folder name
                    input.form-control(v-model="contextCode", type='text', placeholder='')
              el-tab-pane(label="Steps" name="steps")
                .box-body.no-padding(style="min-height: 400px")
                  .table-controls
                    a.btn.btn-default.btn-sm(type='button', data-toggle="tooltip" title="Reload")
                      i.fa.fa-refresh.text-blue.fa-lg
                    router-link.btn.btn-default.btn-sm(v-if="id" :to="id + '/graph'", data-toggle="tooltip" title="Graph")
                      i.fa.fa-snowflake-o.text-danger.fa-lg
                  el-tree.tree-grid(
                    :expand-on-click-node="false"
                    :render-content="renderContent"
                    :data="collection"
                    :props="defaultProps"
                    node-key="globalId"
                    ref='tree'
                    highlight-current=true
                  )
              el-tab-pane(label="Scheduling" name="scheduling")
                .box-body.no-padding(style="min-height: 400px")
                  .table-controls
                    a.btn.btn-default.btn-sm(@click='reload' type='button', data-toggle="tooltip" title="Reload",)
                      i.fa.fa-refresh.text-blue.fa-lg
                    router-link.btn.btn-default.btn-sm(to='/connection',data-toggle="tooltip" title="New",)
                      i.fa.fa-plus.text-green.fa-lg
                    a.btn.btn-default.btn-sm(@click="removeSch", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
                      i.fa.fa-trash-o.text-danger.fa-lg
                    router-link.btn.btn-default.btn-sm(:to="'connection/' + selected[0] + '/clone'", data-toggle="tooltip" title="Clone", :class="selected.length == 1 ? '':'hidden'")
                      i.fa.fa-clone.text-primary.fa-lg
                  .table-responsive.connection-items
                    table.table.table-hover
                      tbody
                        tr(v-for="m in lpsch")
                          td(style="width:20px")
                            label.el-checkbox
                              span.el-checkbox__input(:class="selected.indexOf(m.id)>-1 ? 'is-checked':''")
                                span.el-checkbox__inner
                                input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.id')
                          td 
                            router-link(:to="'connection/' + m.id" ) {{m.name}}
          .box-footer
            a.btn.btn-danger.js-cancel-btn(v-on:click="close") Close
</template>

<script>

import _ from 'lodash'
import { mapGetters } from 'vuex'
import { Tabs, TabPane } from 'element-ui'

export default {
  name: 'LoadPlan',
  props: ['id', 'cloneFrom', 'contextId'],
  data () {
    return {
      value1: true,
      title: 'Load Plan',
      defaultProps: {
        children: 'childrenSteps',
        label: 'name'
      },
      context: {
        name: '',
        agents: [],
        schemas: []
      },
      selected: [],
      switches: {},
      activeNameTab: 'steps'
    }
  },
  watch: {
  },
  methods: {
    reload () {
    },
    removeSch () {
    },
    onSwitch (id) {
      console.log(id)
    },
    checkChange (data, checked, indeterminate) {
      this.selected = this.$refs.tree.getCheckedKeys()
    },
    renderContent (h, { node, data, store }) {
      let icon = ''
      let tooltip = ''
      let cls = ''
      switch (data.stepType) {
        case 'SERIAL' : icon = 'fa fa-minus'; tooltip = 'Serial step'; cls = 'text-danger'; break
        case 'PARALLEL' : icon = 'fa fa-bars'; tooltip = 'Parallel step'; cls = 'text-yellow'; break
        default: icon = 'fa fa-cog'; tooltip = 'Step'; cls = 'text-success'
      }

      const label = <span>&nbsp;&nbsp; {node.label}</span>
      return (
        <div style="display:inline;width:100%;">
          <span class={cls} data-toggle="tooltip" title={tooltip}><i class={icon} aria-hidden="true"></i></span>
          <span>{label}</span>
          <span class="pull-right" style="padding-right:8px; margin:0 auto;">
            <el-switch v-model={data.enabled}></el-switch>
          </span>
        </div>
      )
    },
    save: function () {
    },
    close: function () {
      window.history.back()
    },
    setValues () {
    }
  },
  computed: {
    ...mapGetters('sch', [
      'scenarioFolders'
    ]),
    ...mapGetters('arch', [
      'contexts'
    ]),
    loadPlan () {
      const id = parseInt(this.id)
      const findLoadPlan = (node) => {
        let lp
        lp = _.find(node.loadPlans, {internalId: id})
        if (lp) {
          return lp
        } else {
          _.each(node.subFolders, folder => {
            const res = findLoadPlan(folder)
            if (res) {
              lp = res
            }
          })
        }
        return lp
      }
      return _.cloneDeep(findLoadPlan(this.scenarioFolders))
    },
    lpsch () {
      return _.map(this.loadPlan.schedules, x => {
        return {
          id: x.internalId,
          name: `${x.contextCode} \\ ${x.logicalAgentName}`
        }
      })
    },
    collection () {
      return this.loadPlan.rootStep.childrenSteps
    },
    contextCode () {
      return this.context.name.toUpperCase()
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
