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
        router-link.btn.btn-default.btn-sm(to='/task',data-toggle="tooltip" title="New",)
          i.fa.fa-plus.text-green.fa-lg
        router-link.btn.btn-default.btn-sm(to='/import' data-toggle="tooltip" title="Import")
          i.fa.fa-upload.text-yellow.fa-lg
                
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
                        
                  a.top(href='javascript:void(0)', slot='reference')
                    | {{m.dependencies.length}}
              td 
                span.label(
                  :style="'border-radius:0px; background-color:'+ m.primaryGroup.color+';'", 
                  data-toggle="tooltip" title="Group"
                ) {{m.primaryGroup.name}}
              td 
                router-link(v-show="m.plan" :to="'plan/' + m.plan.id" ) {{m.plan.name}}  

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
      i.fa.big-icon.text-gray-harbor.fa-cog(style="text-align: center;")
    div(style="width:100%; margin-top: 20px;display: inline-block;")
      span.text-gray-harbor(style="font-size:20px;") You don't have any task!  
    div(style="width:70%; margin-top: 20px;display: inline-block;")
      router-link.btn.btn-block.btn-primary.btn-lg(to='parameter') Create Task

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import Popper from 'vue-popperjs'

export default {
  name: 'Tasks',
  data () {
    return {
      title: 'Tasks',
      selected: [],
      pageSize: 10,
      pagination: {currentPage: 1},
      maxPaginationSize: 7,
      filter: '',
      q: {}
    }
  },
  computed: {
    ...mapGetters('tasks', [
      'tasks'
    ]),
    total () {
      let tasks = this.tasks.all
      if (_.isEmpty(this.filter)) {
        return tasks.length
      }
      tasks = _.filter(tasks, task => {
        return task.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      })
      return tasks.length
    },
    collection () {
      let tasks = this.tasks.all
      if (!_.isEmpty(this.filter)) {
        tasks = _.filter(tasks, task => {
          return task.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
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
    }
  },
  methods: {
    ...mapActions('tasks', [
      'findAll',
      'bookmark',
      'removeBookmark'
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
    }
  },
  mounted () {
    this.q.plan = this.$route.query.plan ? parseInt(this.$route.query.plan) : null

    this.$store.dispatch('tasks/findAll', this.q)
  },
  components: {
    'popper': Popper
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

</style>
