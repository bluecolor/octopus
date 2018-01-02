<template lang="pug">
.row
  .col-md-6.col-md-offset-3  
    .box.box-primary
      .box-header.with-border
        h3.box-title Session Task
      .panel-body(style="height:620px")
        ul.nav.nav-tabs
          li.active
            a(href='#task-instance-general', data-toggle='tab', aria-expanded='true') General
          li
            a(href='#task-instance-script', data-toggle='tab', aria-expanded='false') Script
          li
            a(href='#task-instance-dependencies', data-toggle='tab', aria-expanded='false') Dependencies
          li
            a(href='#task-instance-groups', data-toggle='tab', aria-expanded='false') Groups
          li
            a(href='#task-instance-owners', data-toggle='tab', aria-expanded='false') Owners
          li
            a(href='#task-instance-logs', data-toggle='tab', aria-expanded='false') Logs
        .tab-content
          #task-instance-general.tab-pane.active.in(style="margin:10px")
            .box-body
              .form-group
                label Name
                .input-group
                  input.form-control(readonly=true v-model="taskInstance.name")
                  router-link.btn.btn-default.input-group-addon(:to="'/task/' + taskInstance.task.id" ) Go
              .form-group
                label Retry Count
                input.form-control(value=0 type='number' readonly=true)
              .form-group
                label Priority
                div(style="min-width:400px")
                  vue-slider(
                    ref="slider" 
                    v-model="value" 
                    :data=['Low', 'Medium', 'High', 'Top']
                    piecewise=true 
                    tooltip="hover" 
                    :speed=0.2)
              .form-group
                label Description
                textarea.form-control(style='height:263px;resize:none;', readonly=true)
          #task-instance-script.tab-pane(style="margin:10px")
            .box-body
              .form-group
                label Technology
                select.form-control(v-model="taskInstance.technology")
                  option(v-for="m in technologies" :value="m.id")  {{m.name}}
              section
                codemirror(
                  ref="script" 
                  :code="taskInstance.script" 
                  :options="editorOptions")
          #task-instance-dependencies.tab-pane(style="margin:10px")
            .table-responsive.connection-items
              table.table.table-hover
                tbody
                  tr(v-for="m in taskInstance.dependencies")
                    td(style="width:100px")
                      span.label(style="border-radius:0px;", :class = 'labelByStatus(m.status)'  data-toggle="tooltip" title="Status") {{m.status}} 
                    td 
                      router-link(:to="'task-instance/' + m.id" ) {{m.name}}
          #task-instance-groups.tab-pane(style="margin:10px")
            .table-responsive.connection-items
              table.table.table-hover
                tbody
                  tr(v-for="m in taskInstance.task.groups")
                    td 
                      router-link(:to="'task-instance/' + m.id" ) {{m.name}}  
          #task-instance-owners.tab-pane(style="margin:10px")
            .table-responsive.connection-items
              table.table.table-hover
                tbody
                  tr(v-for="m in taskInstance.task.owners")
                    td 
                      router-link(:to="'user/' + m.id" ) {{m.name}}
          #task-instance-logs.tab-pane(style="margin:10px")
            .table-responsive.connection-items
              table.table.table-hover
                tbody
                  tr(v-for="m in taskInstance.logs")
                    td(style="width:100px")
                      span.label(:class="labelByStatus(m.status)"  data-toggle="tooltip" title="Status") {{m.status}} 
                    td(style="width:100px") {{toDateString(m.date)}}
                    td(style="width:100px") {{`${(m.log==null?'':m.log).substring(0,30)}...`}}
                    td(style="width:20px")
                      a.js-more(href='javascript:void(0);' style='margin-right:20px' model-id!='<%- id %>')
                        i.fa.fa-ellipsis-h.text-green-fade.fa-lg
      .box-footer
        a.btn.btn-danger.js-cancel-btn Close
        a.ladda-button.btn.btn-primary.pull-right.js-save-btn(data-style="expand-left") Save 
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import vueSlider from 'vue-slider-component'
import { codemirror } from 'vue-codemirror'
import { getLabelByStatus, dateString } from '../../util'

require('codemirror/addon/display/autorefresh.js')
require('codemirror/addon/selection/active-line.js')
// styleSelectedText
require('codemirror/addon/selection/mark-selection.js')
require('codemirror/addon/search/searchcursor.js')
// highlightSelectionMatches
require('codemirror/addon/scroll/annotatescrollbar.js')
require('codemirror/addon/search/matchesonscrollbar.js')
require('codemirror/addon/search/searchcursor.js')
require('codemirror/addon/search/match-highlighter.js')
// keyMap
require('codemirror/mode/clike/clike.js')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/addon/comment/comment.js')
require('codemirror/addon/dialog/dialog.js')
require('codemirror/addon/dialog/dialog.css')
require('codemirror/addon/search/searchcursor.js')
require('codemirror/addon/search/search.js')
require('codemirror/keymap/sublime.js')
// foldGutter
require('codemirror/addon/fold/foldgutter.css')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/comment-fold.js')
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/xml-fold.js')

export default {
  name: 'TaskInstance',
  props: ['id'],
  data () {
    return {
      value: 'Low',
      editorOptions: {
        readOnly: true,
        autoRefresh: {delay: 250},
        tabSize: 4,
        mode: 'text/x-sql',
        lineNumbers: true,
        line: true,
        keyMap: 'sublime',
        extraKeys: { 'Ctrl': 'autocomplete' },
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        styleSelectedText: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
      },
      taskInstance: {
        technology: '',
        dependencies: [],
        task: {}
      }
    }
  },
  computed: {
    ...mapGetters('technology', [
      'technologies'
    ]),
    ...mapGetters('taskInstances', [
      'taskInstances'
    ])
  },
  methods: {
    labelByStatus (s) {
      return getLabelByStatus(s)
    },
    toDateString (x) {
      return dateString(x)
    }
  },
  components: {
    vueSlider,
    codemirror
  },
  mounted () {
    const id = parseInt(this.id)
    this.taskInstance = _.find(this.taskInstances.all, {id})
  }
}
</script>

<style lang="scss">
.vue-slider-component {
  padding: 2px !important;
}
</style>
