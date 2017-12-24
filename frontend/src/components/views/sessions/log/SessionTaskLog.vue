<template lang="pug">
  section.content
    .row
      .col-md-6.col-md-offset-3  
        .box.box-primary
          .box-header.with-border
            h3.box-title {{title}}
          form(role='form')
            el-tabs(v-model="activeNameTab" @tabClick="")
              el-tab-pane(label="Definition", name="definition")
                .box-body
                  .form-group
                    label Name
                    input.form-control(v-model="log.name" disabled=true)
                  .form-group
                    label Duration
                    input.form-control(v-model="log.duration" disabled=true)
                  .form-group
                    label Start time
                    input.form-control(v-model="log.startTime" disabled=true)
                  .form-group
                    label End time
                    input.form-control(v-model="log.endTime" disabled=true)
              el-tab-pane(label="Code" name="code")
                .box-body.no-padding
                  el-tabs(v-model="codeActiveTab" :tab-position="codeTabPos" @tabClick="")
                    el-tab-pane(label="Target", name="target")
                      .table-controls
                        a.btn.btn-default.btn-sm(@click='copyTargetCommand' type='button', data-toggle="tooltip" title="Copy to clipboard")
                          i.fa.fa-clipboard.text-blue.fa-lg
                      codemirror(
                        ref="targetCommand" 
                        :code="taskLog.resolvedTargetCommand" 
                        :options="editorOptions"
                      )
                    el-tab-pane(label="Source", name="source")
                      .table-controls
                        a.btn.btn-default.btn-sm(@click='copySourceCommand' type='button', data-toggle="tooltip" title="Copy to clipboard")
                          i.fa.fa-clipboard.text-blue.fa-lg
                      codemirror(
                        ref="sourceCommand" 
                        :code="taskLog.resolvedSourceCommand" 
                        :options="editorOptions"
                      )
              el-tab-pane(label="Error" name="error")
                codemirror(
                  ref="error" 
                  :code="taskLog.errorMessage" 
                  :options="editorOptions"
                )
          .box-footer
            a.btn.btn-danger.js-cancel-btn(v-on:click="close") Close
</template>

<script>

import moment from 'moment'
import { codemirror } from 'vue-codemirror'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { Tabs, TabPane } from 'element-ui'

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
  name: 'SessionTaskLog',
  props: ['globalId'],
  data () {
    return {
      title: 'Session Task Log',
      selected: [],
      activeNameTab: 'definition',
      codeActiveTab: 'target',
      codeTabPos: 'right',
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
      }
    }
  },
  methods: {
    close: function () {
      window.history.back()
    },
    setValues () {
    },
    copy (value) {
      let dummy = document.createElement('textarea')
      dummy.id = 'dummy_id'
      document.querySelector('body').appendChild(dummy)
      let clip = document.getElementById(dummy.id)
      clip.value = value
      clip.select()
      const status = document.execCommand('copy')
      if (!status) {
        console.log('failed to copy')
      } else {
        this.$notify({
          title: '',
          message: 'Copied command to clipboard',
          type: 'success'
        })
      }
      document.body.removeChild(clip)
    },
    copyTargetCommand () {
      this.copy(this.editor.target.getValue())
    },
    copySourceCommand () {
      this.copy(this.editor.source.getValue())
    }
  },
  computed: {
    ...mapGetters('sessions', [
      'sessions'
    ]),
    editor () {
      return {
        target: this.$refs.targetCommand.editor,
        source: this.$refs.sourceCommand.editor,
        error: this.$refs.error.editor
      }
    },
    taskLog () {
      return _.chain(this.sessions)
        .map(s => s.sessionStepLogs)
        .flatten()
        .map(s => s.sessionTaskLogs)
        .flatten()
        .find({globalId: this.globalId})
        .value()
    },
    log () {
      return {
        name: this.taskLog.name,
        duration: this.taskLog.duration,
        startTime: moment.unix(this.taskLog.startTime / 1000).format('YYYY-MM-DD HH:mm'),
        endTime: moment.unix(this.taskLog.endTime / 1000).format('YYYY-MM-DD HH:mm')
      }
    }
  },
  mounted () {
    this.setValues()
  },
  destroyed () {
  },
  components: {
    Tabs,
    TabPane,
    codemirror
  }
}
</script>

<style>
.table-controls .btn {
  color: inherit !important;
}
</style>

