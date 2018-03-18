<template lang="pug">
.row
  .col-md-8.col-md-offset-2(v-if="sessions.all.length > 0 || hasFilter")
    .box.box-primary(style="border-top=0px")
      .box-header.with-border
        h3.box-title {{title}}
        .box-tools.pull-right
          .has-feedback.table-search
            input.form-control.input-sm.search-box(autofocus=true, v-model="filter.search" type='text', placeholder='Search')
      .box-body.no-padding
        .table-controls
          a.btn.btn-default.btn-sm(@click='onReload' type='button', data-toggle="tooltip" title="Reload",)
            i.fa.fa-refresh.text-blue.fa-lg
          a.btn.btn-default.btn-sm(@click="onRemove", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
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
            ul.dropdown-menu
              li
                a(@click="onStop" href='javascript:void(0);') Stop
              li
                a(@click="onStop" href='javascript:void(0);') Start
              li.divider(role='separator')
              li
                a(@click="onRemove" href='javascript:void(0);') Delete

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
              | {{filter.status ? filter.status : 'Status'}}
              span.caret
            ul.dropdown-menu
              li(v-for="m in ['RUNNING', 'IDLE', 'ERROR', 'SUCCESS']")
                a(href='javascript:void(0);' @click="onStatusFilter(m)" ) {{m}}
              li.footer
                a(href='javascript:void(0);' @click="onStatusFilter") All
          .dropdown.pull-right(style="display:inline;")
            a.btn.btn-default.btn-sm.dropdown-toggle(type='button', data-toggle='dropdown', aria-haspopup='true', aria-expanded='true')
              | {{filter.plan ? filter.plan.name : 'Plan'}}
              span.caret
            ul.dropdown-menu
              li(v-for="m in plans")
                a(href='javascript:void(0);' @click="onPlanFilter(m)") {{m.name}}
              li.footer
                a(href='javascript:void(0);' @click="onPlanFilter") All
          a.btn.btn-default.btn-sm.pull-right(@click="onClearFilter", data-toggle="tooltip" title="Clear filters" :class="hasFilter ? '':'hidden'")
            i.fa.fa-filter.text-danger.fa-lg
            | Clear filters
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
                      router-link(:to="'task-instances?session=' + m.id" data-toggle="tooltip" title="Session name") {{m.name}}
                  div.session-detail(style="height:100%; width:100%; overflow: hidden;")
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
                        router-link(:to="'plan/' + m.plan.id" data-toggle="tooltip" title="See plan") {{m.plan.name}}
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
            :total-items="sessions.meta.count"
            v-model="pagination"
            :max-size="maxPaginationSize"
            class="pagination-sm"
            :boundary-links="true"
            :rotate="false"
            :items-per-page="15"
            @change="onPage"
          )
  .align-center(v-else)
    div.no-connection(v-if="loading === false && sessions.all.length === 0" style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
      div(style="width:100%; display: inline-block;")
        i.fa.big-icon.text-gray-harbor.fa-tasks(style="text-align: center;")
      div(style="width:100%; margin-top: 20px;display: inline-block;")
        span.text-gray-harbor(style="font-size:20px;") You do not have any sessions !
    div.no-connection(v-if="loading" style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
      pulse-loader(:loading="loading" color="#d2d6de")

</template>

<script>

import _ from 'lodash'
import moment from 'moment'
import {mapGetters, mapActions} from 'vuex'
import {getLabelByStatus} from '../../util'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  data () {
    return {
      title: 'Sessions',
      selected: [],
      pageSize: 15,
      pagination: {currentPage: 1},
      maxPaginationSize: 7,
      filter: {
        sort: {
          by: 'name',
          order: 'desc'
        },
        search: undefined,
        plan: undefined,
        status: undefined,
        clear () {
          this.search = undefined
          this.plan = undefined
          this.status = undefined
        }
      }
    }
  },
  computed: {
    ...mapGetters('sessions', [
      'sessions',
      'loading'
    ]),
    ...mapGetters('plans', [
      'plans'
    ]),
    total () {
      return this.sessions.count
    },
    collection () {
      return _.orderBy(this.sessions.all, ['status', 'startDate'], ['asc', 'desc'])
    },
    hasFilter () {
      return !(
        _.isEmpty(this.filter.search) &&
        _.isEmpty(this.filter.plan) &&
        _.isEmpty(this.filter.status)
      )
    }
  },
  watch: {
    selected () {
      if (this.selected.length > 1) {
        this.selected.splice(0, 1)
      }
    },
    sessions () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('sessions', [
      'remove', 'stop', 'start'
    ]),
    onRemove () {
      const id = this.selected[0]
      if (!id) { return }
      this.remove(id)
    },
    onStop () {
      const id = this.selected[0]
      if (!id) { return }
      this.stop(id)
    },
    onStart () {
      const id = this.selected[0]
      if (!id) { return }
      this.start(id)
    },
    onReload () {
      const search = this.filter.search
      const plan = this.filter.plan ? this.filter.plan.id : undefined
      const status = this.filter.status
      const page = this.pagination.currentPage - 1
      this.$store.dispatch('sessions/findAll', {
        status,
        plan,
        search,
        page
      })
    },
    onPage () {
      this.onReload()
    },
    statusLabel (status) {
      return getLabelByStatus(status)
    },
    dateString (x) {
      if (x) {
        return moment.unix(x / 1000).format('YYYY-MM-DD HH:mm')
      }
    },
    progress (s) {
      return (s.total === 0) ? 100 : Math.floor(100 * (s.success + s.done) / s.total)
    },
    bg (stats) {
      if (stats.error > 0) {
        return 'background-color: antiquewhite'
      }
    },
    onStatusFilter (m) {
      this.filter.status = m
      this.onReload()
    },
    onPlanFilter (m) {
      this.filter.plan = m
      this.onReload()
    },
    onClearFilter () {
      this.filter.clear()
      this.onReload()
    }
  },
  components: {
    'pulse-loader': PulseLoader
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
