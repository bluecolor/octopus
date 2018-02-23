<template lang="pug">
.col-md-8.col-md-offset-2(v-if="collection.length > 0")
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
        router-link.btn.btn-default.btn-sm(to='/plan',data-toggle="tooltip" title="New",)
          i.fa.fa-plus.text-green.fa-lg
        router-link.btn.btn-default.btn-sm(to='/import' data-toggle="tooltip" title="Import")
          i.fa.fa-upload.text-yellow.fa-lg
        a.btn.btn-default.btn-sm(@click="onDelete", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-trash-o.text-danger.fa-lg

        .dropdown(style="display:inline;" :class="selected.length > 0 ? '':'hidden'")
            button.btn.btn-default.btn-sm.dropdown-toggle(
              type='button', 
              data-toggle='dropdown', 
              aria-haspopup='true', 
              aria-expanded='true'
              style="color:#212121;"
            )
              | More
              span.caret
            ul.dropdown-menu(aria-labelledby='dm1')
              li  
                a(href='javascript:void(0);') Run
              li.divider(role='separator')
              li  
                router-link(:to="'/plan/'+selected[0]+'?clone=true'") Clone
              li.divider(role='separator')
              li
                a(href='javascript:void(0);' @click="onExportPlan") Export Plan
              li  
                a(href='javascript:void(0);' @click="onExportTasks") Export Tasks  
              li.divider(role='separator')
              li
                a(href='javascript:void(0);' @click="onProtect") Protect
              li
                a(href='javascript:void(0);' @click="onUnprotect") Unprotect
              li.divider(role='separator')
              li
                a(href='javascript:void(0);' @click="onDeleteSessions") Delete Sessions
        .dropdown.pull-right(style="display:inline;")
          a.btn.btn-default.btn-sm.dropdown-toggle.text-green(type='button', data-toggle='dropdown', aria-haspopup='true', aria-expanded='true')
            | Sort By
            span.caret
          ul.dropdown-menu
            li
              a(href='javascript:void(0);') Name ascending
            li
              a(href='javascript:void(0);') Name descending
      .table-responsive.connection-items
        table.table.table-hover
          tbody
            tr(v-for="m in collection")
              td(style="width:20px")
                label.el-checkbox
                  span.el-checkbox__input(:class="selected.indexOf(m.id)>-1 ? 'is-checked':''")
                    span.el-checkbox__inner
                    input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.id')
              td(style="width:20px")
                span.fa.fa-lg.fa-shield.text-red-plum(v-show="m.protect" data-toggle="tooltip" title="Protected")  
              td 
                router-link(:to="'plan/' + m.id" ) {{m.name}}
              td 
                span {{m.parallel}} parallel
              td 
                router-link(:to="'/tasks?plan='+ m.id") {{m.stats.taskCount}} tasks  
              td 
                router-link(:to="'connection/' + m.connection.id" ) {{m.connection.name}}
              td
                span.label(:class="m.active ? 'label-success':'label-danger'") {{ `${m.active ? 'Active': 'Not Active'}` }}

    .box-footer.clearfix
      ul.pagination.pagination-sm.no-margin.pull-right  
        uib-pagination(
          :total-items="total" 
          v-model="pagination" 
          :max-size="maxPaginationSize" 
          class="pagination-sm" 
          :boundary-links="true" 
          :rotate="false"
        )  
.align-center(v-else)
  div.no-connection(style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
    div(style="width:100%; display: inline-block;")
      i.fa.big-icon.text-gray-harbor.fa-calendar-check-o(style="text-align: center;")
    div(style="width:100%; margin-top: 20px;display: inline-block;")
      span.text-gray-harbor(style="font-size:20px;") You don't have any plans!  
    div(style="width:70%; margin-top: 20px;display: inline-block;")
      router-link.btn.btn-block.btn-primary.btn-lg(to='plan') Create Plan

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'Plans',
  data () {
    return {
      title: 'Plans',
      selected: [],
      pageSize: 10,
      pagination: {currentPage: 1},
      maxPaginationSize: 7,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('plans', [
      'plans'
    ]),
    total () {
      if (_.isEmpty(this.filter)) {
        return this.plans.length
      }
      const plans = _.filter(this.plans, plan => {
        return plan.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      })
      return plans.length
    },
    collection () {
      let plans = this.plans
      if (!_.isEmpty(this.filter)) {
        plans = _.filter(this.plans, plan => {
          return plan.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        })
      }
      const i = (this.pagination.currentPage - 1) * this.pageSize
      return _.slice(plans, i, i + this.pageSize)
    }
  },
  watch: {
    selected: function () {
      if (this.selected.length > 1) {
        this.selected.splice(0, 1)
      }
    },
    plans: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('plans', [
      'findAll',
      'remove',
      'unProtect',
      'protect'
    ]),
    pageChange (p) {
      this.currentPage = p
    },
    onUnprotect () {
      this.unProtect(this.selected[0])
    },
    onProtect () {
      this.protect(this.selected[0])
    },
    onDelete () {
      const id = this.selected[0]
      const m = _.find(this.plans, {id})
      const message = `Are you sure?`
      const options = {
        loader: true,
        okText: 'Delete',
        cancelText: 'Close',
        type: 'hard',
        verification: m.name
      }
      this.$dialog.confirm(message, options).then((d) => {
        this.remove(id).finally(() => {
          d.close()
        })
      })
    },
    onExportPlan () {
      const id = this.selected[0]
      window.location = `api/v1/plans/export/${id}`
    },
    onExportTasks () {
      const id = this.selected[0]
      window.location = `api/v1/plans/export-tasks/${id}`
    },
    onDeleteSessions () {}
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

  .text-red-plum {
    color: #E57373
  }

</style>
