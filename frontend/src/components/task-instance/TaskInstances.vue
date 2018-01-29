<template lang="pug">
.row
  .col-md-10.col-md-offset-1(v-if="collection.length > 0")
    .box.box-primary(style="border-top=0px")
      .box-header.with-border
        h3.box-title {{title}}
        .box-tools.pull-right
          .has-feedback.table-search
            input.form-control.input-sm.search-box(autofocus=true, v-model="filter" type='text', placeholder='Search')
      .box-body.no-padding
        .table-controls
          a.btn.btn-default.btn-sm(@click='' type='button', data-toggle="tooltip" title="Reload",)
            i.fa.fa-refresh.text-blue.fa-lg
          a.btn.btn-default.btn-sm(@click="", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
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
                a(href='javascript:void(0);') Done
              li  
                a(href='javascript:void(0);') Stop
              li  
                a(href='javascript:void(0);') Start
              li  
                a(href='javascript:void(0);') Block
              li.divider(role='separator')
              li
                a(href='javascript:void(0);') Delete

          .dropdown.pull-right(style="display:inline;")
            a.btn.btn-default.btn-sm.dropdown-toggle.text-green(type='button', data-toggle='dropdown', aria-haspopup='true', aria-expanded='true')
              | Sort By
              span.caret
            ul.dropdown-menu(aria-labelledby='dropdownMenu1')
              li
                a(href='javascript:void(0);') Status ascending
              li
                a(href='javascript:void(0);') Status descending
              li.divider(role='separator')
              li
                a(href='javascript:void(0);') Name ascending
              li
                a(href='javascript:void(0);') Name descending
              li.divider(role='separator')
              li
                a(href='javascript:void(0);') Duration ascending
              li
                a(href='javascript:void(0);') Duration descending

          .dropdown.pull-right(style="display:inline;")
            a.btn.btn-default.btn-sm.dropdown-toggle(type='button', data-toggle='dropdown', aria-haspopup='true', aria-expanded='true')
              | Status
              span.caret
            ul.dropdown-menu(aria-labelledby='dropdownMenu2')
              li
                a(href='javascript:void(0);') RUNNING
              li
                a(href='javascript:void(0);') IDLE
              li
                a(href='javascript:void(0);') ERROR
              li
                a(href='javascript:void(0);') SUCCESS

        .table-responsive.connection-items
          table.table.table-hover
            tbody
              tr(v-for="m in collection")
                td(style="width:20px")
                  label.el-checkbox
                    span.el-checkbox__input(:class="selected.indexOf(m.id)>-1 ? 'is-checked':''")
                      span.el-checkbox__inner
                      input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.id')
                td(style="width:100px")
                  span.label(style="border-radius:0px;", :class = 'labelByStatus(m.status)'  data-toggle="tooltip" title="Status") {{m.status}} 
                td 
                  router-link(:to="'task-instance/' + m.id" ) {{m.name}}
                td 
                  span.label(
                    :style="'border-radius:0px; background-color:'+ m.task.primaryGroup.color+';'", 
                    data-toggle="tooltip" title="Group"
                  ) {{m.task.primaryGroup.name}}
                td 
                  popper(trigger='click', :options="{placement: 'left'}")
                    .popper(v-show="m.dependencies.length > 0")
                      div(slot="content")
                        ul.pop-menu
                          li(v-for="d in m.dependencies")
                            router-link(:to="'task-instance/' + d.id") {{d.name}}
                          
                    a.top(href='javascript:void(0)', slot='reference')
                      | {{m.dependencies.length}}
                td 
                  span(data-toggle="tooltip" title="Start date") {{dateString(m.startDate)}}
                td 
                  span(data-toggle="tooltip" title="End date") {{dateString(m.endDate)}}
                td(style="width:200px;")
                  .progress.progress-striped(style="margin-bottom:0px;" data-toggle="tooltip" title="Progress")
                    .progress-bar.progress-bar-info(role='progressbar', :style ="'width:'+ progress(m) + '%;'")
                      |  {{progress(m)}}%                

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
        i.fa.big-icon.text-gray-harbor.fa-tasks(style="text-align: center;")
      div(style="width:100%; margin-top: 20px;display: inline-block;")
        span.text-gray-harbor(style="font-size:20px;") No task instance for this session!
      
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import { getLabelByStatus } from '../../util'
import Popper from 'vue-popperjs'
import 'vue-popperjs/dist/css/vue-popper.css'

export default {
  name: 'TaskInstances',
  data () {
    return {
      session: this.$route.query.session,
      title: 'Task Instances',
      selected: [],
      pageSize: 10,
      pagination: {currentPage: 1},
      maxPaginationSize: 7,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('taskInstances', [
      'taskInstances'
    ]),
    total () {
      let taskInstances = this.taskInstances.all
      if (_.isEmpty(this.filter)) {
        return taskInstances.length
      }
      taskInstances = _.filter(taskInstances, t => {
        return t.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      })
      return taskInstances.length
    },
    collection () {
      let taskInstances = this.taskInstances.all
      if (!_.isEmpty(this.filter)) {
        taskInstances = _.filter(this.taskInstances, t => {
          return t.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        })
      }
      const i = (this.pagination.currentPage - 1) * this.pageSize
      return _.slice(taskInstances, i, i + this.pageSize)
    }
  },
  watch: {
    selected: function () {
      if (this.selected.length > 1) {
        this.selected.splice(0, 1)
      }
    },
    connections: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('taskInstances', [
      'findAll'
    ]),
    pageChange (p) {
      this.currentPage = p
    },
    labelByStatus (s) {
      return getLabelByStatus(s)
    },
    dateString (x) {
      return moment.unix(x / 1000).format('YYYY-MM-DD HH:mm')
    },
    progress (m) {
      if (['SUCCESS', 'DONE'].indexOf(m.status) !== -1) {
        return 100
      }
      if (['ERROR', 'IDLE', 'KILLED', 'BLOCKED'].indexOf(m.status) !== -1) {
        return 0
      }
      if (m.task.stats === null || m.task.stats.avgDuration === null || m.task.stats.avgDuration === 0) {
        return Math.floor(Math.random() * 100)
      }
      if (m.task.stats === null) {
        return 0
      }

      return Math.floor(100 * moment
        .duration(moment(new Date())
        .diff(moment(m.startDate)))
        .asSeconds() / m.task.stats.avgDuration)
    },
    onDependenciesClick (e, m) {
      console.log(e)
    }
  },
  components: {
    'popper': Popper
  },
  mounted () {
    this.$store.dispatch('taskInstances/findAll', {
      session: parseInt(this.session)
    })
  }
}
</script>

<style lang="scss">

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

  .pop-menu {
    list-style: none;
    margin: 0;
    padding: 5px 0;
    a {
      display: block;
      padding: 8px 10px;
    }
    li:hover {
      background-color:antiquewhite; color:#fff;
    }
  }

</style>
