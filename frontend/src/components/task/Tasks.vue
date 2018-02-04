<template lang="pug">
.col-md-8.col-md-offset-2(v-if="collection.length > 0")
  .box.box-primary(style="border-top=0px")
    .box-header.with-border
      h3.box-title {{title}}
      .box-tools.pull-right
        .has-feedback.table-search
          input.form-control.input-sm.search-box(autofocus=true, v-model="filter.search" type='text', placeholder='Search')
    .box-body.no-padding
      .table-controls
        a.btn.btn-default.btn-sm(@click='reload' type='button', data-toggle="tooltip" title="Reload",)
          i.fa.fa-refresh.text-blue.fa-lg
        router-link.btn.btn-default.btn-sm(to='/task',data-toggle="tooltip" title="New",)
          i.fa.fa-plus.text-green.fa-lg
        router-link.btn.btn-default.btn-sm(to='/import' data-toggle="tooltip" title="Import")
          i.fa.fa-upload.text-yellow.fa-lg
        a.btn.btn-default.btn-sm(@click="onRemove", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-trash-o.text-danger.fa-lg
        
        .dropdown(v-show="selected.length > 0" style="display:inline;")
            button.btn.btn-default.btn-sm.dropdown-toggle(type='button', data-toggle='dropdown', aria-haspopup='true', aria-expanded='true')
              | More
              span.caret
            ul.dropdown-menu(aria-labelledby='dropdownMenu1')
              li  
                a(href='javascript:void(0);') Run
              li.divider(role='separator')
              li
                router-link(:to="'/task/'+selected[0]+'?clone=true'") Clone
              li
                a(href='javascript:void(0);') Dependencies
              li  
                a(href='javascript:void(0);') Export
              li.divider(role='separator')
              li
                a(href='javascript:void(0);') Enable
              li
                a(href='javascript:void(0);') Disable
              li.divider(role='separator')
              li
                a(href='javascript:void(0);') Delete
        .dropdown.pull-right(style="display:inline;")
            a.btn.btn-default.btn-sm.dropdown-toggle.text-green(type='button', data-toggle='dropdown', aria-haspopup='true', aria-expanded='true')
              | Sort By
              span.caret
            ul.dropdown-menu(aria-labelledby='dropdownMenu1')
              li
                a(href='javascript:void(0);') Name ascending
              li
                a(href='javascript:void(0);') Name descending
              li.divider(role='separator')
              li
                a(href='javascript:void(0);') Avg. duration ascending
              li
                a(href='javascript:void(0);') Avg. duration descending
              li.divider(role='separator')                
              li
                a(href='javascript:void(0);') Most crashing              
              li
                a(href='javascript:void(0);') Least crashing
        .dropdown.pull-right(style="display:inline;")
            button.btn.btn-default.btn-sm.dropdown-toggle(type='button', data-toggle='dropdown', aria-haspopup='true', aria-expanded='true')
              | Owners
              span.caret
            ul.dropdown-menu
              li(v-for="m in users")
                router-link(to="'/users/' + m.id") {{m.name}}
        .dropdown.pull-right(style="display:inline;")
            button.btn.btn-default.btn-sm.dropdown-toggle(type='button', data-toggle='dropdown', aria-haspopup='true', aria-expanded='true')
              | Groups
              span.caret
            ul.dropdown-menu
              li(v-for="m in groups")
                a(href='javascript:void(0);') {{m.name}}
        .dropdown.pull-right(style="display:inline;")
            button.btn.btn-default.btn-sm.dropdown-toggle(type='button', data-toggle='dropdown', aria-haspopup='true', aria-expanded='true')
              | {{filter.plan.id===undefined ? 'Plans' : filter.plan.name }}
              span.caret
            ul.dropdown-menu
              li(v-for="m in plans")
                a(href='javascript:void(0);' @click="onPlanSelect(m)") {{m.name}}
              li.footer(v-if='plans.length > 0')
                a(href='javascript:void(0);' @click="onPlanSelect()") All
      .table-responsive.connection-items
        table.table.table-hover
          tbody
            tr(v-for="m in collection")
              td(style="width:20px")
                label.el-checkbox
                  span.el-checkbox__input(:class="selected.indexOf(m.id)>-1 ? 'is-checked':''")
                    span.el-checkbox__inner
                    input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.id')
              td 
                a.pull-left(@click="setBookmark(m)" href='javascript:void(0)' style='margin-right:20px' )
                  i.fa.fa-lg(:class="`${m.bookmarked ? 'fa-bookmark text-yellow': 'fa-bookmark-o text-gray'}`")
              td 
                router-link(:to="'task/' + m.id" ) {{m.name}}
              td 
                popper(trigger='click', :options="{placement: 'left'}")
                  .popper(v-show="m.dependencies.length > 0")
                    div(slot="content")
                      ul.pop-menu
                        li(v-for="d in m.dependencies")
                          router-link(:to="'task/' + d.id") {{d.name}}
                        
                  a.top(href='javascript:void(0)', slot='reference' data-toggle="tooltip" title="Dependencies")
                    | {{m.dependencies.length}}
              td 
                span.label(
                  :style="'border-radius:0px; background-color:'+ m.primaryGroup.color+';'", 
                  data-toggle="tooltip" title="Group"
                ) {{m.primaryGroup.name}}
              td 
                router-link(v-show="m.plan" :to="'plan/' + m.plan.id" data-toggle="tooltip" title="Plan") {{m.plan.name}}  

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
.align-center.hidden(v-else-if="collection.length === 0 && filter.search.length === 0")
  div.no-connection(v-if="collection.length === 0 && !loading" style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
    div(style="width:100%; display: inline-block;")
      i.fa.big-icon.text-gray-harbor.fa-cog(style="text-align: center;")
    div(style="width:100%; margin-top: 20px;display: inline-block;")
      span.text-gray-harbor(style="font-size:20px;") You don't have any task!  
    div(style="width:70%; margin-top: 20px;display: inline-block;")
      router-link.btn.btn-block.btn-primary.btn-lg(to='/task') Create Task
  div.no-connection(style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
    pulse-loader(:loading="loading" color="#d2d6de")

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import Popper from 'vue-popperjs'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'Tasks',
  data () {
    return {
      title: 'Tasks',
      loading: false,
      selected: [],
      pageSize: 10,
      pagination: {currentPage: 1},
      maxPaginationSize: 7,
      filter: {
        search: '',
        plan: {},
        group: {},
        owner: {}
      },
      q: {}
    }
  },
  computed: {
    ...mapGetters('tasks', [
      'tasks'
    ]),
    ...mapGetters('users', [
      'users'
    ]),
    ...mapGetters('groups', [
      'groups'
    ]),
    ...mapGetters('plans', [
      'plans'
    ]),
    total () {
      let tasks = this.tasks.all
      if (_.isEmpty(this.filter.search)) {
        return tasks.length
      }
      tasks = _.filter(tasks, task => {
        return task.name.toLowerCase().indexOf(this.filter.search.toLowerCase()) !== -1
      })
      return tasks.length
    },
    collection () {
      let tasks = this.tasks.all
      if (!_.isEmpty(this.filter.search)) {
        tasks = _.filter(tasks, task => {
          return task.name.toLowerCase().indexOf(this.filter.search.toLowerCase()) !== -1
        })
      }
      const i = (this.pagination.currentPage - 1) * this.pageSize
      return _.slice(tasks, i, i + this.pageSize)
    }
  },
  watch: {
    selected: function () {
      if (this.selected.length > 1) {
        this.selected.splice(0, 1)
      }
    },
    tasks: function () {
      this.selected = []
      this.loading = false
    }
  },
  methods: {
    ...mapActions('tasks', [
      'findAll',
      'bookmark',
      'removeBookmark',
      'remove'
    ]),
    pageChange (p) {
      this.currentPage = p
    },
    clone () {
    },
    setBookmark (task) {
      if (!task.bookmarked) {
        this.bookmark(task.id)
      } else {
        this.removeBookmark(task.id)
      }
    },
    reload () {
      this.loading = true
      this.$store.dispatch('tasks/findAll', this.q)
    },
    onRemove () {
      const id = this.selected[0]
      this.remove(id).finally(() => (this.selected = []))
    },
    onPlanSelect (plan) {
      this.filter.plan = plan !== undefined ? plan : {}
    }
  },
  mounted () {
    if (this.$route.query.plan) {
      const id = parseInt(this.$route.query.plan)
      this.filter.plan = _.find(this.plans, {id})
      this.q.plan = id
    }
    this.$store.dispatch('tasks/findAll', this.q)
  },
  components: {
    'popper': Popper,
    'pulse-loader': PulseLoader
  }
}
</script>

<style>

  .text-gray {
    color: #d2d6de !important
  }

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

  .popper {
    box-shadow: rgb(255, 251, 251) 0 0 6px 0;
    background-color: #fff;	
  }

  .dropdown-menu>li.footer>a {
    border-top: 0.5px solid #f3ebeb
  }


</style>
