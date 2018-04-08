<template lang='pug'>
.row
  .col-md-6.col-md-offset-3
    .box.box-primary
      .box-header.with-border
        h3.box-title {{title}}
      .panel-body(style='height:620px')
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
          #task-general.tab-pane.active.in(style='margin:10px')
            .box-body
              .form-group
                label Name
                input.form-control(v-model="task.name" placeholder='Task name ...', required=true, autofocus=true)
              .form-group
                label Connection
                .input-group
                  select.form-control(v-model='task.connection')
                    option(v-for='m in connections' :value='m.id')  {{m.name}}
                  router-link.btn.btn-default.input-group-addon(to='/connection')
                    span.fa.text-success.fa-plus
              .form-group
                label Plan
                .input-group
                  select.form-control(v-model='task.plan')
                    option(v-for='m in plans' :value='m.id')  {{m.name}}
                  router-link.btn.btn-default.input-group-addon(to='/plan')
                    span.fa.text-success.fa-plus
              .form-group
                label Retry Count
                input.form-control(v-model="task.retry" value=0 type='number' required=false, min='0')
              .form-group
                label Priority
                div(style='min-width:400px')
                  vue-slider(
                    ref='slider'
                    v-model='task.priority'
                    :data="priority"
                    piecewise=true
                    tooltip='hover'
                    :speed=0.2)
              .form-group
                  label Active
                  fieldset
                    .radio.radio-inline.radio-danger(style='display:inline')
                      input#radio-active-yes(v-model="task.active", type='radio', name='radio-active', value=1, checked='1')
                      label(for='radio-active-yes')
                        | Yes
                    .radio.radio-inline.radio-danger(style='display:inline')
                      input#radio-active-no(v-model="task.active", type='radio', name='radio-active', value=0)
                      label(for='radio-active-no')
                        | No
              .form-group
                label Description
                textarea.form-control(v-model="task.description")
          #task-script.tab-pane(style='margin:10px;height:620px;')
            .box-body
                .form-group
                  label Technology
                  select.form-control(v-model='task.technology')
                    option(v-for='m in technologies' :value='m.id')  {{m.name}}
                section
                  codemirror(
                    ref='script'
                    v-model='task.script'
                    :options='editorOptions'
                  )
          #task-dependencies.tab-pane(style='margin:10px')
            .form-group
              v-select(label='name',
                :filterable='false',
                :options='dependencies.options',
                @search='onSearchDep',
                @input='onSelectDep')
                template(slot='no-options')
                  | type to search tasks..
                template(slot='option', slot-scope='option')
                  .d-center
                    |         {{ option.name }}
                template(slot='selected-option', scope='option')
                  .selected.d-center
                    |         {{ option.name }}

            .table-responsive.connection-items
              table.table.table-hover
                tbody
                  tr(v-for="m in task.dependencies")
                    td
                      router-link(:to="'task-instance/' + m.id" ) {{m.name}}
                    td
                      a.pull-right(href='javascript:void(0);' @click="onRemoveDep(m)")
                        i.fa.fa-times.text-danger.fa-lg.hover-active
          #task-groups.tab-pane(style="margin:10px")
            .form-group
              v-select(label='name',
                :filterable='false',
                :options='groups',
                @input='onSelectGroup')
                template(slot='no-options')
                  | type to search tasks..
                template(slot='option', slot-scope='option')
                  .d-center
                    div(:style="`border-radius:0px;width:14px;height:14px;background-color:${option.color}`")
                    |&nbsp;&nbsp;&nbsp;         {{ option.name }}
                template(slot='selected-option', scope='option')
                  .selected.d-center
                    div(:style="`border-radius:0px;width:14px;height:14px;background-color:${option.color}`")
                    |&nbsp;&nbsp;&nbsp;         {{ option.name }}
            .table-responsive.connection-items
              table.table.table-hover
                tbody
                  tr(v-for="m in task.groups")
                    td(style="width:20px")
                      a(@click="setPrimaryGroup(m.id)" v-show="task.primaryGroup.id !== m.id" href='javascript:void(0);')
                        span.fa.fa-star-o.text-gray
                      a(v-show="task.primaryGroup.id === m.id" href='javascript:void(0);')
                        span.fa.fa-star.text-yellow
                    td(style="width:20px")
                      div(:style="`border-radius:0px;width:14px;height:14px;background-color:${m.color}`")
                    td
                      router-link(:to="'group/' + m.id" ) {{m.name}}
                    td
                      a.pull-right(href='javascript:void(0);' @click="onRemoveGroup(m)")
                        i.fa.fa-times.text-danger.fa-lg.hover-active
          #task-owners.tab-pane(style="margin:10px")
            .form-group
              v-select(label='name',
                :filterable='false',
                :options='users',
                @input='onSelectUser')
                template(slot='no-options')
                  | type to search tasks..
                template(slot='option', slot-scope='option')
                  .d-center
                    div(:style="`border-radius:0px;width:14px;height:14px;background-color:${option.color}`")
                    |         {{ option.name }}
                template(slot='selected-option', scope='option')
                  .selected.d-center
                    div(:style="`border-radius:op0px;width:14px;height:14px;background-color:${option.color}`")
                    |         {{ option.name }}

            .table-responsive.connection-items
              table.table.table-hover
                tbody
                  tr(v-for='m in task.owners')
                    td(style="width:20px")
                      a(@click="setPrimaryOwner(m.id)" v-show="task.primaryOwner.id !== m.id" href="javascript:void(0);")
                        span.fa.fa-star-o.text-gray
                      a(v-show="task.primaryOwner.id === m.id" href="javascript:void(0);")
                        span.fa.fa-star.text-yellow
                    td
                      router-link(:to="'user/' + m.id" ) {{m.username}}
                    td
                      router-link(:to="'user/' + m.id" ) {{m.name}}
                    td
                      a.pull-right(href='javascript:void(0);' @click="onRemoveOwner(m)")
                        i.fa.fa-times.text-danger.fa-lg.hover-active
      .box-footer
        a.btn.btn-danger(@click='close') Close
        a.ladda-button.btn.btn-primary.pull-right(:class="isValid?'':'disabled'" @click="onSave" data-style='expand-left') Save
</template>

<script>

import _ from 'lodash'
import axios from 'axios'
import {mapGetters, mapActions} from 'vuex'
import vueSlider from 'vue-slider-component'
import { codemirror } from 'vue-codemirror'
import vSelect from 'vue-select'

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
        readOnly: false,
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
      priority: ['Low', 'Medium', 'High', 'Top'],
      dependencies: {
        query: '',
        options: []
      },
      task: {
        name: undefined,
        connection: undefined,
        plan: undefined,
        retry: 1,
        priority: 'Medium',
        active: 1,
        description: undefined,
        technology: undefined,
        primaryGroup: undefined,
        script: undefined,
        dependencies: [],
        groups: [],
        owners: []
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
      'me',
      'users'
    ]),
    isValid () {
      return (
        this.task.name &&
        this.task.retry > -1 &&
        this.task.technology &&
        this.task.script &&
        !_.isEmpty(this.task.owners)
      )
    }
  },
  methods: {
    ...mapActions('tasks', [
      'create',
      'update'
    ]),
    setPrimaryGroup (id) {
      if (!id && this.task.groups[0]) {
        this.task.primaryGroup = this.task.groups[0]
      } else {
        this.task.primaryGroup = _.find(this.groups, {id})
      }
    },
    setPrimaryOwner (id) {
      if (!id && this.task.owners[0]) {
        this.task.primaryOwner = this.task.owners[0]
      } else {
        this.task.primaryOwner = _.find(this.users, {id})
      }
    },
    close () {
      window.history.back()
    },
    onSearchDep (search, loading) {
      loading(true)
      this.searchDep(loading, search, this)
    },
    searchDep: _.debounce((loading, search, vm) => {
      axios.get(`api/v1/tasks/search?q=${escape(search)}`).then(response => {
        vm.dependencies.options = _.filter(response.data, r => r.id !== vm.task.id)
        loading(false)
      })
    }, 120),
    onSelectDep (task) {
      if (!task) {
        return
      }
      const t = _.find(this.task.dependencies, {id: task.id})
      if (!t) {
        this.task.dependencies.push(task)
      }
    },
    onSelectGroup (group) {
      if (!group) {
        return
      }
      const g = _.find(this.task.groups, {id: group.id})
      if (!g) {
        this.task.groups.push(group)
      }
      if (this.task.groups.length === 1) {
        this.task.primaryGroup = this.task.groups[0]
      }
    },
    onRemoveGroup (group) {
      const i = _.findIndex(this.task.groups, {id: group.id})
      this.task.groups.splice(i, 1)
      if (group.id === this.task.primaryGroup && this.task.groups.length > 0) {
        this.task.primaryGroup = this.task.groups[0]
      } else if (_.isEmpty(this.task.groups)) {
        this.task.primaryGroup = null
      }
    },
    onRemoveOwner (owner) {
      const i = _.findIndex(this.task.owners, {id: owner.id})
      this.task.owners.splice(i, 1)
    },
    onRemoveDep (task) {
      const i = _.findIndex(this.task.dependencies, {id: task.id})
      this.task.dependencies.splice(i, 1)
    },
    onSelectUser (user) {
      if (!user) {
        return
      }
      const id = user.id
      const u = _.find(this.users, {id})
      if (!_.find(this.task.owners, {id})) {
        this.task.owners.push(u)
      }
      if (this.task.owners.length === 1) {
        this.task.primaryOwner = u
      }
    },
    init (id) {
      let task = _.chain(this.tasks.all).find({id}).cloneDeep().value()
      if (task) {
        task.primaryGroup = task.primaryGroup ? task.primaryGroup : undefined
        task.primaryOwner = task.primaryOwner ? task.primaryOwner : undefined
        task.technology = task.technology ? task.technology.id : undefined
        task.connection = task.connection ? task.connection.id : undefined
        task.plan = task.plan.id ? task.plan.id : undefined
        task.active = task.active ? 1 : 0
        task.priority = this.priority[Math.max(task.priority, 1) - 1]
        this.task = task
      }
    },
    onSave () {
      this.task.priority = this.$refs.slider.getIndex() + 1
      this.task.active = (this.task.active === 1)
      if (this.$route.query.clone === 'true') {
        this.task.id = undefined
        this.create(this.task)
      } else if (this.task.id) {
        this.update(this.task)
      } else {
        this.create(this.task)
      }
    }
  },
  components: {
    vueSlider,
    codemirror,
    vSelect
  },
  mounted () {
    if (this.id) {
      this.init(parseInt(this.id))
    }
    this.onSelectUser(this.me)
  }
}
</script>

<style>
.input-group-addon {
  line-height: 1.56;
}

.name {
  font-weight: 700;
  font-size: 18px;
}
.screen-name {
  font-style: italic;
}

img {
  height: auto;
  max-width: 2.5rem;
  margin-right: 1rem;
}

.d-center {
  display: flex;
  align-items: center;
}

.selected img {
  width: auto;
  max-height: 23px;
  margin-right: 0.5rem;
}

.v-select .dropdown li {
  border-bottom: 1px solid rgba(112, 128, 144, 0.1);
}

.v-select .dropdown li:last-child {
  border-bottom: none;
}

.v-select .dropdown li a {
  padding: 10px 20px;
  width: 100%;
  font-size: 1.25em;
  color: #3c3c3c;
}

.v-select .dropdown-menu .active > a {
  color: #fff;
}

.hover-active {
  opacity: 0.3;
}
.hover-active:hover {
  opacity: 1;
}

.input-group-addon {
  border-bottom-right-radius: 3px !important;
  border-top-right-radius: 3px !important;
}

.CodeMirror {
  height: 450px !important;
  border: solid 1px #cccccc96;
  border-radius: 3px;
}

.CodeMirror-gutters {
  border-right: 1px solid rgba(255,255,255,.15);
  background-color: #dddddd1c;
}

</style>
