<template lang="pug">
.col-md-8.col-md-offset-2(v-if="transfers.length > 0")
  .box.box-primary(style="border-top=0px")
    .box-header.with-border
      h3.box-title {{title}}
      .box-tools.pull-right
        .has-feedback.table-search
          input.form-control.input-sm.search-box(autofocus=true, v-model="filter" type='text', placeholder='Search')
    .box-body.no-padding
      .table-controls
        a.btn.btn-default.btn-sm(@click='findAll' type='button', data-toggle="tooltip" title="Reload",)
          i.fa.fa-refresh.text-blue.fa-lg
        a.btn.btn-default.btn-sm(@click="remove", data-toggle="tooltip" title="Delete", :class="removable ? '':'hidden'")
          i.fa.fa-trash-o.text-danger.fa-lg
        a.btn.btn-default.btn-sm(@click="cancel", data-toggle="tooltip" title="Cancel", :class="cancellable ? '': 'hidden'")
          i.fa.fa-hand-paper-o.text-warning.fa-lg
        
      .table-responsive.connection-items
        table.table.table-hover
          tbody
            tr(v-for="m in collection")
              td(style="width:20px")
                label.el-checkbox
                  span.el-checkbox__input(:class="selected.indexOf(m.id)>-1 ? 'is-checked':''")
                    span.el-checkbox__inner
                    input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.id')
              td(width="200px") {{m.startTimeStr}}
              td {{m.transferType}}
              td 
                span.label(:class="getLabelClass(m.status)") {{m.status}}
              td
                a(@click="download(m.id)" :class="(m.transferType=='EXPORT' && m.status=='SUCCESS') ? 'pointer':'hidden'")
                  | Download
    .box-footer.clearfix
      ul.pagination.pagination-sm.no-margin.pull-right  
        el-pagination(@current-change="pageChange" layout='prev, pager, next', :total="total", :page-size="pageSize")  
.align-center(v-else)
  div.no-connection(style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
    div(style="width:100%; display: inline-block;")
      i.fa.big-icon.text-gray-harbor.fa-cloud(style="text-align: center;")
    div(style="width:100%; margin-top: 20px;display: inline-block;")
      span.text-gray-harbor(style="font-size:20px;") You do not have any transfers !

</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'Transfers',
  data () {
    return {
      title: 'Transfers',
      selected: [],
      pageSize: 10,
      currentPage: 1,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('transfer', [
      'transfers'
    ]),
    total () {
      if (_.isEmpty(this.filter)) {
        return this.transfers.length
      }
      const transfers = _.filter(this.transfers, t => {
        return t.log.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      })
      return transfers.length
    },
    collection () {
      let transfers = this.transfers.map(t => {
        t.startTimeStr = moment.unix(t.startTime / 1000).format('YYYY-MM-DD HH:mm:ss')
        return t
      })
      if (!_.isEmpty(this.filter)) {
        transfers = _.filter(this.transfers, t => {
          return t.log.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        })
      }
      const i = (this.currentPage - 1) * this.pageSize
      return _.slice(transfers, i, i + this.pageSize)
    },
    cancellable () {
      if (_.isEmpty(this.selected)) { return false }
      const status = _.find(this.transfers, {id: this.selected[0]}).status
      return ['SUCCESS', 'ERROR', 'CANCELLED'].indexOf(status) === -1
    },
    removable () {
      if (_.isEmpty(this.selected)) { return false }
      const status = _.find(this.transfers, {id: this.selected[0]}).status
      return ['SUCCESS', 'ERROR', 'CANCELLED'].indexOf(status) > -1
    }
  },
  watch: {
    transfers: function () {
      this.selected = []
    },
    selected: function () {
      if (this.selected.length > 1) {
        this.selected.splice(0, 1)
      }
    }
  },
  methods: {
    ...mapActions('transfer', [
      'findAll'
    ]),
    getLabelClass (s) {
      switch (s) {
        case 'READY': return 'label-warning'
        case 'SUCCESS': return 'label-success'
        case 'ERROR': return 'label-danger'
        case 'RUNNING': return 'label-primary'
        default: return 'label-default'
      }
    },
    pageChange (p) {
      this.currentPage = p
    },
    download (transferId) {
      console.log('click')
    },
    remove () {
    },
    cancel () {}
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

  .pointer {
    cursor: pointer;
  }

</style>
