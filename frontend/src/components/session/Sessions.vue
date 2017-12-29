<template lang="pug">
.row
  .col-md-8.col-md-offset-2(v-if="collection.length > 0")
    .box.box-primary(style="border-top=0px")
      .box-header.with-border
        h3.box-title {{title}}
        .box-tools.pull-right
          .has-feedback.table-search
            input.form-control.input-sm.search-box(autofocus=true, v-model="filter" type='text', placeholder='Search')
      .box-body.no-padding
        .table-controls
          a.btn.btn-default.btn-sm(@click='findSessions' type='button', data-toggle="tooltip" title="Reload",)
            i.fa.fa-refresh.text-blue.fa-lg
          a.btn.btn-default.btn-sm(@click="deleteSession(selected[0])", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
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
                a(href='javascript:void(0);') Stop
              li  
                a(href='javascript:void(0);') Start
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
                a(href='javascript:void(0);') Schedule date ascending
              li
                a(href='javascript:void(0);') Schedule date descending
              li.divider(role='separator')
              li
                a(href='javascript:void(0);') Start date ascending
              li
                a(href='javascript:void(0);') Start date descending              
          
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
              tr(v-for="m in collection" :style="bg(m.stats)")
                td(style="width:20px")
                  label.el-checkbox
                    span.el-checkbox__input(:class="selected.indexOf(m.id)>-1 ? 'is-checked':''")
                      span.el-checkbox__inner
                      input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.id')  
                td(style="width:570px")
                  div(style="height:100%; width:100%; overflow: hidden;")
                    div.session-status
                      span.label(style="border-radius:0px;" :class="statusLabel(m.status)"  data-toggle="tooltip" title="Status") {{m.status}} 
                    div.session-name
                      router-link(:to="'task-instances?session=' + m.id" data-toggle="tooltip" title="Name") {{m.name}}
                  div.session-detail(style="height:100%; width:100%; overflow: hidden;")
                    div.session-stat(style="padding-right:2px;")
                      router-link(:to="'sessions/' + m.id" data-toggle="tooltip" title="See tasks") details
                    div.session-detail-label(data-toggle="tooltip" title="Completed tasks")
                      span completed:
                    div.session-stat
                      router-link(:to="'task-instances?session=' + m.id" data-toggle="tooltip" title="See tasks") {{m.stats.success+m.stats.done}}/{{m.stats.total}} &ensp;
                    div(v-show="m.stats.error > 0")
                      div.session-detail-label(data-toggle="tooltip" title="Errors")
                        span.text-danger(style="font-weight:bold;") error: 
                      div.session-stat
                        router-link(:to="'task-instances?session=' + m.id" data-toggle="tooltip" title="See tasks") {{m.stats.error}} &ensp;
                    div(v-show="m.plan !== undefined")
                      div.session-detail-label(data-toggle="tooltip" title="Completed tasks")
                        span plan: 
                      div.session-plan
                        router-link(:to="'plans/' + m.plan.id" data-toggle="tooltip" title="See plan") {{m.plan.name}}
                  td(style="width:200px")
                    span(data-toggle="tooltip" title="Session start date") {{dateString(m.startDate)}}
                  td(style="width:200px")
                    span(data-toggle="tooltip" title="Session end date")  {{dateString(m.endDate)}}
                  td(style="width:20%")
                    .progress.progress-striped(style="margin-bottom:0px;")
                      .progress-bar.progress-bar-info(role='progressbar' :style="'width:' + progress(m.stats) +'%;'")
                        | {{progress(m.stats)}}%


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
        span.text-gray-harbor(style="font-size:20px;") You do not have any sessions !  
</template>

<script>

import moment from 'moment'
import {mapGetters, mapActions} from 'vuex'
import {getLabelByStatus} from '../../util'

export default {
  data () {
    return {
      title: 'Sessions',
      selected: [],
      pageSize: 10,
      pagination: {currentPage: 1},
      maxPaginationSize: 7,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('sessions', [
      'sessions'
    ]),
    total () {
      return this.sessions.length
    },
    collection () {
      return this.sessions.all
    }
  },
  watch: {
    selected: function () {
      if (this.selected.length > 1) {
        this.selected.splice(0, 1)
      }
    },
    sessions: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('connections', {
      deleteSession: 'remove',
      findSessions: 'find'
    }),
    statusLabel (status) {
      return getLabelByStatus(status)
    },
    dateString (x) {
      return moment.unix(x / 1000).format('YYYY-MM-DD HH:mm')
    },
    progress (s) {
      return (s.total === 0) ? 100 : Math.floor(100 * (s.success + s.done) / s.total)
    },
    bg (stats) {
      if (stats.error > 0) {
        return 'background-color: antiquewhite'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.session-status {
  float: left;
}

.session-name {
  float: left;
  margin-left: 10px;
  font-weight: bold;
}

.session-detail {
  .session-detail-label:not(:first-child){
    margin-left: 10px;
  }
  .session-detail-label{
    float: left;
    opacity: 0.5;
  }
}

.session-stat {
  float: left;
}

.session-detail{
  padding-top: 5px;
}

.session-plan {
  float: left;
  opacity: 0.5;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}
</style>
