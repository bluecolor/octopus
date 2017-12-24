<template lang="pug">
.col-md-8.col-md-offset-2(v-if="loadPlanRuns.length > 0")
  .box.box-primary(style="border-top=0px")
    .box-header.with-border
      h3.box-title {{title}}
      .box-tools.pull-right
        .has-feedback.table-search
          input.form-control.input-sm.search-box(autofocus=true, v-model="filter" type='text', placeholder='Search')
    .box-body.no-padding
      .table-controls
        a.btn.btn-default.btn-sm(data-toggle="tooltip" title="Reload",)
          i.fa.fa-refresh.text-blue.fa-lg
        a.btn.btn-default.btn-sm(@click="remove", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-trash-o.text-danger.fa-lg
        a.btn.btn-default.btn-sm(@click="play" data-toggle="tooltip" title="Restart", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-play.text-success.fa-lg
        
      .table-responsive.connection-items
        table.table.table-hover
          tbody
            tr(v-for="m in collection")
              td(style="width:20px")
                label.el-checkbox
                  span.el-checkbox__input(:class="selected.indexOf(m.globalId)>-1 ? 'is-checked':''")
                    span.el-checkbox__inner
                    input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.globalId')
              td
                span(:class = "status(m.status)" style="font-weight:bolder;") {{m.status}}
              td 
                router-link(:to="'connection/' + m.globalId" ) {{name(m)}}
    .box-footer.clearfix
      ul.pagination.pagination-sm.no-margin.pull-right  
        el-pagination(@current-change="pageChange" layout='prev, pager, next', :total="total", :page-size="pageSize")  
.align-center(v-else)
  div.no-connection(style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
    div(style="width:100%; display: inline-block;")
      i.fa.big-icon.text-gray-harbor.fa-cubes(style="text-align: center;")
    div(style="width:100%; margin-top: 20px;display: inline-block;")
      span.text-gray-harbor(style="font-size:20px;") You do not have any load plan sessions !  
    
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'LoadPlanExecutions',
  data () {
    return {
      title: 'Load Plan Executions',
      selected: [],
      pageSize: 10,
      currentPage: 1,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('sessions', [
      'loadPlanRuns'
    ]),
    total () {
      if (_.isEmpty(this.filter)) {
        return this.loadPlanRuns.length
      }
      const lpr = _.filter(this.loadPlanRuns, r => {
        return r.loadPlanInstance.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      })
      return lpr.length
    },
    collection () {
      let lpr = this.loadPlanRuns
      if (!_.isEmpty(this.filter)) {
        lpr = _.filter(this.loadPlanRuns, r => {
          return r.loadPlanInstance.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        })
      }
      const i = (this.currentPage - 1) * this.pageSize
      return _.slice(lpr, i, i + this.pageSize)
    }
  },
  watch: {
    selected: function () {
      if (this.selected.length > 1) {
        this.selected.splice(0, 1)
      }
    },
    loadPlanRuns: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('sessions', [
      'deleteLoadPlanRun'
    ]),
    remove () {
      this.deleteLoadPlanRun(this.selected[0])
    },
    play () {
    },
    status (s) {
      switch (s) {
        case 'ERROR': return 'text-red'
        case 'RUNNING': return 'text-blue'
        case 'SUCCESS': return 'text-green'
      }
    },
    name (m) {
      const d = moment.unix(m.startTime / 1000).format('YYYY-MM-DD HH:mm:ss')
      return `${m.loadPlanInstance.internalId} - ${m.loadPlanInstance.name} - ${d}`
    },
    pageChange (p) {
      this.currentPage = p
    },
    clone () {
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

  .box {
    border-top: 0px;
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

  .default-text {
    color: #F44336;
    font-weight: bolder;
    opacity: 0.6;
  }

</style>
