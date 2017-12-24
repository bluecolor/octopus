<template lang="pug">
.col-md-8.col-md-offset-2(v-if="physicalAgents.length > 0")
  .box(style="border-top=0px")
    .box-header.with-border
      h3.box-title {{title}}
      .box-tools.pull-right
        .has-feedback.table-search
          input.form-control.input-sm.search-box(autofocus=true, v-model="filter", type='text', placeholder='Search')
    .box-body.no-padding
      .table-controls
        a.btn.btn-default.btn-sm(@click='findPhysicalAgents' type='button', data-toggle="tooltip" title="Reload",)
          i.fa.fa-refresh.text-blue.fa-lg
        router-link.btn.btn-default.btn-sm(to='/physical-agent',data-toggle="tooltip" title="New",)
          i.fa.fa-plus.text-green.fa-lg
        router-link.btn.btn-default.btn-sm(to='/physical-agents/import' data-toggle="tooltip" title="Import")
          i.fa.fa-upload.text-yellow.fa-lg
        a.btn.btn-default.btn-sm(@click="remove", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-trash-o.text-danger.fa-lg
        a.btn.btn-default.btn-sm(@click="test", data-toggle="tooltip" title="Test", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-flask.text-yellow.fa-lg
        a.btn.btn-default.btn-sm(@click="exportPhysicalAgent", data-toggle="tooltip" title="Export", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-download.text-green.fa-lg  
        router-link.btn.btn-default.btn-sm(:to="'physical-agent/' + selected[0] + '/clone' ", data-toggle="tooltip" title="Clone", :class="selected.length == 1 ? '':'hidden'")
          i.fa.fa-clone.text-primary.fa-lg
      .table-responsive.connection-items
        table.table.table-hover
          tbody
            tr(v-for="m in collection")
              td(style="width:20px")
                label.el-checkbox
                  span.el-checkbox__input(:class="selected.indexOf(m.agentId)>-1 ? 'is-checked':''")
                    span.el-checkbox__inner
                    input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.agentId')
              td 
                router-link(:to="'physical-agent/' + m.agentId" ) {{m.name}}
              td {{m.url}}
              td 
                span.text-green(v-show="m.runningTaskCount > 0" style="font-weight:bold;") Running {{m.runningTaskCount}} tasks
    .box-footer.clearfix
      ul.pagination.pagination-sm.no-margin.pull-right  
        el-pagination(@current-change="pageChange" layout='prev, pager, next', total="total", :page-size="pageSize")
.align-center(v-else)
  div.no-connection(style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
    div(style="width:100%; display: inline-block;")
      i.fa.big-icon.text-gray-harbor.fa-cogs(style="text-align: center;")
    div(style="width:100%; margin-top: 20px;display: inline-block;")
      span.text-gray-harbor(style="font-size:20px;") You do not have any agents yet !  
    div(style="width:70%; margin-top: 20px;display: inline-block;")
      router-link.btn.btn-block.btn-primary.btn-lg(to='physical-agents/new') Create Agent
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'PhysicalAgents',
  data () {
    return {
      title: 'Physical Agents',
      selected: [],
      pageSize: 10,
      currentPage: 1,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('arch', [
      'physicalAgents'
    ]),
    total () {
      if (_.isEmpty(this.filter)) {
        return this.physicalAgents.length
      }
      const agents = _.filter(this.physicalAgents, agent => {
        return agent.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      })
      return agents.length
    },
    collection () {
      let agents = this.physicalAgents
      if (!_.isEmpty(this.filter)) {
        agents = _.filter(this.physicalAgents, agent => {
          return agent.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        })
      }
      const i = (this.currentPage - 1) * this.pageSize
      return _.slice(agents, i, i + this.pageSize)
    }
  },
  watch: {
    selected: function () {
    },
    physicalAgents: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('arch', [
      'findPhysicalAgents',
      'testPhysicalAgent',
      'deletePhysicalAgent'
    ]),
    pageChange (p) {
      this.currentPage = p
    },
    clone () {
    },
    select (id) {
      const i = this.selected.indexOf(id)
      if (i > -1) {
        this.selected.splice(i, 1)
      } else {
        this.selected.push(id)
      }
    },
    test () {
      _.each(this.selected, a => this.testPhysicalAgent(a))
    },
    remove () {
      _.each(this.selected, a => this.deletePhysicalAgent(a))
    },
    exportPhysicalAgent () {
      // const id = this.selected[0]
      // window.location = `api/v1/connections/${id}`
    }
  },
  mounted () {
  }
}
</script>

<style>
  .no-connection {
    margin: 100px auto !important;
    text-align: center !important;
    width: 100px;
    height: 100px;
    text-align: center !important;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 50px auto; 
  }

  .align-center {
    height: 500px;
    vertical-align: middle;
  }

  .big-icon {
    font-size: 132px; 
  }

  .text-gray-harbor {
    color: #757D75; 
  }

</style>
