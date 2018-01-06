<template lang="pug">
.row
  .col-md-6.col-md-offset-3  
    .box.box-primary
      .box-header.with-border
        h3.box-title {{title}}
      .panel-body(style="height:620px")
        ul.nav.nav-tabs
          li.active
            a(href='#task-general', data-toggle='tab', aria-expanded='true') General
          li
            a(href='#task-script', data-toggle='tab', aria-expanded='false') Script
          li
            a(href='#task-dependencies', data-toggle='tab', aria-expanded='false') Dependencies
          li
            a(href='#task-groups', data-toggle='tab', aria-expanded='false') Groups
          li
            a(href='#task-owners', data-toggle='tab', aria-expanded='false') Owners
        .tab-content
          #task-general.tab-pane.active.in(style="margin:10px")
            .box-body
              .form-group
                label Name
                input.form-control(placeholder='Task name ...', required=true, autofocus=true)
              .form-group
                label Connection
                .input-group
                  select.form-control(v-model="task.connection")
                    option(v-for="m in connections" :value="m.id")  {{m.name}}
                  router-link.btn.btn-default.input-group-addon(to="/connection")
                    span.fa.text-success.fa-plus    
              .form-group
                label Plan
                .input-group
                  select.form-control(v-model="task.plan")
                    option(v-for="m in plans" :value="m.id")  {{m.name}}
                  router-link.btn.btn-default.input-group-addon(to="/plan")
                    span.fa.text-success.fa-plus    
              .form-group
                label Retry Count
                input.form-control(value=0 type='number' required=false, min='0')
              .form-group
                label Priority
                div(style="min-width:400px")
                  vue-slider(
                    ref="slider" 
                    v-model="task.priority" 
                    :data=['Low', 'Medium', 'High', 'Top']
                    piecewise=true 
                    tooltip="hover" 
                    :speed=0.2)
              .form-group
                  label Active
                  fieldset
                    .radio.radio-inline.radio-danger(style="display:inline")
                      input#radio-active-1(type='radio', name='radio-active', value='1',checked='1')
                      label(for='radio1')
                        | Yes
                    .radio.radio-inline.radio-danger(style="display:inline")
                      input#radio-active-2(type='radio', name='radio-active', value='0')
                      label(for='radio2')
                        | No
              .form-group
                label Description
                textarea.form-control(rows='3')
          #task-script.tab-pane(style="margin:10px")
            .box-body
                .form-group
                  label Technology
                  select.form-control(v-model="task.technology")
                    option(v-for="m in technologies" :value="m.id")  {{m.name}}
                section
                  codemirror(
                    ref="script" 
                    :code="task.script" 
                    :options="editorOptions") 
          #task-dependencies.tab-pane(style="margin:10px")
            .form-group
              select.form-control()
                option(v-for="m in tasks" :value="m.id")  {{m.name}}
            .table-responsive.connection-items
              table.table.table-hover
                tbody
                  tr(v-for="m in task.dependencies")
                    td(style="width:100px")
                      span.label(style="border-radius:0px;", :class = 'labelByStatus(m.status)'  data-toggle="tooltip" title="Status") {{m.status}} 
                    td 
                      router-link(:to="'task-instance/' + m.id" ) {{m.name}}
          #task-groups.tab-pane(style="margin:10px")
            .form-group
              select.form-control()
                option(v-for="m in groups" :value="m.id")  {{m.name}}
            .table-responsive.connection-items
              table.table.table-hover
                tbody
                  tr(v-for="m in task.groups")
                    td 
                      router-link(:to="'group/' + m.id" ) {{m.name}}  
          #task-owners.tab-pane(style="margin:10px")
            .form-group
              select.form-control()
                option(v-for="m in users" :value="m.id")  {{m.name}}
            .table-responsive.connection-items
              table.table.table-hover
                tbody
                  tr(v-for="m in task.owners")
                    td 
                      router-link(:to="'user/' + m.id" ) {{m.name}}
      .box-footer
        a.btn.btn-danger(@click="close") Close
        a.disabled.ladda-button.btn.btn-primary.pull-right(data-style="expand-left") Save
</template>

<script>
import {mapGetters} from 'vuex'
import vueSlider from 'vue-slider-component'
import { codemirror } from 'vue-codemirror'

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
  props: ['id'],
  data () {
    return {
      title: 'Task',
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
      task: {
        priority: 0,
        connection: null,
        plan: null,
        technology: null,
        script: '',
        dependencies: []
      }
    }
  },
  computed: {
    ...mapGetters('connections', [
      'connections'
    ]),
    ...mapGetters('plans', [
      'plans'
    ]),
    ...mapGetters('technology', [
      'technologies'
    ]),
    ...mapGetters('tasks', [
      'tasks'
    ]),
    ...mapGetters('groups', [
      'groups'
    ]),
    ...mapGetters('users', [
      'users'
    ])
  },
  methods: {
    close () {
      window.history.back()
    }
  },
  components: {
    vueSlider,
    codemirror
  }
}
</script>

<style lang="scss" scoped>
.input-group-addon {
  line-height: 1.56;
}
</style>
