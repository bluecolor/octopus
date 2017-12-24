<template lang="pug">
.col-md-8.col-md-offset-2(v-if="collection.length > 0")
  el-dialog(title='Test Connection', :visible.sync='testOptions.dialogVisible', size='tiny')
    el-form(:model='testOptions.data')
      el-form-item.agent(label='Agent' label-width='72px')
        el-select(v-model='testOptions.data.agent', placeholder='Please select an agent')
          el-option(label="No Agent" key="", value='')
          el-option(v-for="m in physicalAgents", :label="m.name" :key="m.agentId", :value='m.agentId')
    span.dialog-footer(slot='footer')
      el-button(@click='testOptions.dialogVisible = false') Cancel
      el-button(type='primary', @click='testConnection') Test
  .box(style="border-top=0px")
    .box-header.with-border
      h3.box-title {{title}}
      .box-tools.pull-right
        .has-feedback.table-search
          input.form-control.input-sm.search-box(v-model="filter" type='text', placeholder='Search')
    .box-body.no-padding
      .table-controls
        a.btn.btn-default.btn-sm.js-reload-btn(@click='findTechnologies' type='button', data-toggle="tooltip" title="Reload",)
          i.fa.fa-refresh.text-blue.fa-lg
        router-link.js-item.js-new-plan.btn.btn-default.btn-sm(to='data-server',data-toggle="tooltip" title="New",)
          i.fa.fa-plus.text-green.fa-lg
        router-link.js-item.btn.btn-default.btn-sm.js-import-btn(to='/data-servers/import' data-toggle="tooltip" title="Import")
          i.fa.fa-upload.text-yellow.fa-lg
        a.btn.btn-default.btn-sm(@click="remove", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-trash-o.text-danger.fa-lg
        a.btn.btn-default.btn-sm(@click="test", data-toggle="tooltip" title="Test", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-flask.text-yellow.fa-lg
        a.btn.btn-default.btn-sm(@click="", data-toggle="tooltip" title="Export", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-download.text-green.fa-lg  
        a.btn.btn-default.btn-sm(@click="", data-toggle="tooltip" title="Clone", :class="selected.length == 1 ? '':'hidden'")
          i.fa.fa-clone.text-primary.fa-lg

      .table-responsive.connection-items
        table.table.table-hover
          tbody
            tr(v-for="m in collection")
              td(style="width:20px")
                label.el-checkbox
                  span.el-checkbox__input(:class="selected.indexOf(m.internalId)>-1 ? 'is-checked':''")
                    span.el-checkbox__inner
                    input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.internalId')
              td 
                router-link(:to="'data-server/' + m.internalId" ) {{m.name}}
              td(align="center")
                router-link(:to="'physical-technology/' + m.internalId" data-toggle="tooltip" title="Details")
                  i.fa.text-gray-harbor.fa-database          
    .box-footer.clearfix
      ul.pagination.pagination-sm.no-margin.pull-right  
        el-pagination(@current-change="pageChange" layout='prev, pager, next', :total="total", :page-size="pageSize")
.align-center(v-else)
  div.no-connection(style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
    div(style="width:100%; display: inline-block;")
      i.fa.big-icon.text-gray-harbor.fa-database(style="text-align: center;")
    div(style="width:100%; margin-top: 20px;display: inline-block;")
      span.text-gray-harbor(style="font-size:20px;") You do not have any data servers yet!
    div(style="width:70%; margin-top: 20px;display: inline-block;")
      router-link.btn.btn-block.btn-primary.btn-lg(to='data-server') Create Dataserver
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'DataServers',
  props: ['id'],
  data () {
    return {
      testOptions: {
        dialogVisible: false,
        data: {
          agent: ''
        }
      },
      selected: [],
      pageSize: 10,
      currentPage: 1,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('arch', [
      'technologies',
      'dataServers',
      'physicalAgents'
    ]),
    ...mapGetters([
      'connectionId'
    ]),
    title () {
      const technology = _.find(this.technologies, {internalId: parseInt(this.id)})
      return `${technology.name} - Data Servers`
    },
    total () {
      let dataServers = this.dataServers(this.id)
      if (_.isEmpty(this.filter)) {
        return dataServers.length
      }
      dataServers = _.filter(dataServers, ds => {
        return ds.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      })
      return dataServers.length
    },
    collection () {
      let dataServers = this.dataServers(this.id)
      if (!_.isEmpty(this.filter)) {
        dataServers = _.filter(dataServers, ds => {
          return ds.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        })
      }
      const i = (this.currentPage - 1) * this.pageSize
      return _.slice(dataServers, i, i + this.pageSize)
    }
  },
  watch: {
    selected: function () {
    },
    technologies: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('arch', [
      'findTechnologies',
      'testDataServer',
      'deleteDataServer'
    ]),
    pageChange (p) {
      this.currentPage = p
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
      this.testOptions.dialogVisible = true
    },
    testConnection () {
      this.testOptions.dialogVisible = false
      const payload = {
        dataServerId: this.selected,
        agentId: this.testOptions.data.agent
      }
      this.testDataServer(payload)
    },
    remove () {
      _.each(this.selected, dataServerId => this.deleteDataServer(dataServerId))
      this.selected = []
    }
  },
  mounted () {
  }
}
</script>

<style>

  td i {
    opacity: 0.1;
  }

  td:hover i,
  td:hover + td i {
    opacity: 1;          
  }

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
