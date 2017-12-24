<template lang="pug">
.row
  .col-md-8.col-md-offset-2(v-if="sess.length > 0")
    el-dialog(title='Start Session(s)', :visible.sync='dialogVisible', size='tiny')
      el-form(:model='start')
        el-form-item.agent(label='Agent' label-width='72px')
          el-select(v-model='start.agent', placeholder='Please select an agent')
            el-option(label='Zone No.1', value='shanghai')
            el-option(label='Zone No.2', value='beijing')
        el-form-item(label='Log level' label-width='72px')
          el-slider(v-model='start.logLevel'  show-stops=true :step=1 :max=6 )
      span.dialog-footer(slot='footer')
        el-button(@click='dialogVisible = false') Cancel
        el-button(type='primary', @click='dialogVisible = false') Start
    .box(style="border-top=0px")
      .box-header.with-border
        h3.box-title {{title}}
        .box-tools.pull-right
          .has-feedback.table-search
            input.form-control.input-sm.search-box(autofocus=true, v-model="filters.text" type='text', placeholder='Search')
      .box-body.no-padding
        .table-controls
          a.btn.btn-default.btn-sm(@click="reload" data-toggle="tooltip" title="Reload",)
            i.fa.fa-refresh.text-blue.fa-lg
          a.btn.btn-default.btn-sm(@click="remove" data-toggle="tooltip" title="Delete", :class="checked.length > 0 ? '':'hidden'")
            i.fa.fa-trash-o.text-danger.fa-lg
          a.btn.btn-default.btn-sm(@click="play" data-toggle="tooltip" title="Restart", :class="checked.length > 0 ? '':'hidden'")
            i.fa.fa-play.text-success.fa-lg
          a.btn.btn-default.btn-sm(@click="stop" data-toggle="tooltip" title="Stop", :class="checked.length > 0 ? '':'hidden'")
            i.fa.fa-stop.text-danger.fa-lg
          a.btn.btn-default.btn-sm(@click="done" data-toggle="tooltip" title="Done", :class="checked.length === 1 ? '':'hidden'")
            i.fa.fa-check.text-green.fa-lg
          el-date-picker.pull-right(
            data-toggle="tooltip" 
            title="Session date"
            v-model="filters.date"
            type="date"
            placeholder="Pick a day"
            :picker-options="filters.pickerOptions"
          )
          a.btn.btn-default.btn-sm.pull-right(@click="ownerFilter" data-toggle="tooltip" title="My sessions")
            i.fa.fa-filter.fa-lg(:class="filters.owner ? 'text-red' : 'text-gray-harbor'")
          a.btn.btn-default.btn-sm.pull-right
            i.fa.fa-sort-amount-asc.fa-lg.text-blue
        el-tree.tree-grid(
          :render-content="renderContent", 
          :data="sess"
          :expand-on-click-node="false"
          :show-checkbox=false
          highlight-current=true 
          node-key="name"
          label="name"
          :props="props"
          :filter-node-method="filterSessions",
          ref="sessions"
        )
      .box-footer.clearfix
        ul.pagination.pagination-sm.no-margin.pull-right  
          el-pagination(@current-change="pageChange" layout='prev, pager, next', :total="total", :page-size="pageSize")  
  .align-center(v-else)
    div.no-connection(style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
      div(style="width:100%; display: inline-block;")
        i.fa.big-icon.text-gray-harbor.fa-tasks(style="text-align: center;")
      div(style="width:100%; margin-top: 20px;display: inline-block;")
        span.text-gray-harbor(style="font-size:20px;") You do not have any sessions !  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Tree, Form, Slider } from 'element-ui'
import _ from 'lodash'

export default {
  name: 'Sessions',
  data () {
    return {
      title: 'Sessions',
      pageSize: 10,
      currentPage: 1,
      filters: {
        text: '',
        owner: false,
        date: null,
        pickerOptions: {
          shortcuts: [{
            text: 'Today',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: 'Yesterday',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: 'A week ago',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        }
      },
      checked: [],
      dialogVisible: false,
      start: {
        agent: '',
        logLevel: 3
      },
      props: {
        label: 'name',
        children: 'sessionStepLogs'
      }
    }
  },
  computed: {
    ...mapGetters('sessions', [
      'sessions'
    ]),
    sess: function () {
      return _.map(this.sessions, s => {
        _.each(s.sessionStepLogs, l => {
          l['sessionStepLogs'] = _.filter(l.sessionTaskLogs, t => t.task.taskType === 'INTEGRATION').map(log => {
            return {
              type: 'TaskLog',
              ...log
            }
          })
        })
        return s
      })
    },
    total () {
      return 1
    }
  },
  watch: {
    'filters.text' (val) {
      this.$refs.sessions.filter(val)
    },
    'sessions' () {
    }
  },
  methods: {
    ...mapActions('sessions', [
      'setStatus',
      'findSessions'
    ]),
    ownerFilter () {
      this.filters.owner = !this.filters.owner
    },
    pageChange (p) {
      this.currentPage = p
    },
    remove () {
      console.log('clicked remove')
    },
    stop () {
      console.log('clicked stop')
    },
    play () {
      this.dialogVisible = true
    },
    reload () {
      this.findSessions()
    },
    done () {
      const sessionId = this.checked[0]
      this.setStatus({sessionId: sessionId, status: 'DONE'})
    },
    check (id) {
      const i = this.checked.indexOf(id)
      if (i > -1) {
        this.checked.splice(i, 1)
      } else {
        this.checked.push(id)
      }
    },
    renderContent (h, { node, data, store }) {
      let cls = 'text-success'
      let icon = ''
      let checkbox = ''

      switch (data.status) {
        case 'DONE':
        case 'SUCCESS':
          cls = 'text-success'
          icon = 'fa fa-check-circle'
          break
        case 'ERROR':
          cls = 'text-danger'
          icon = 'fa fa-exclamation-circle'
          break
        case 'WARNING':
          cls = 'text-warning'
          icon = 'fa fa-exclamation-triangle'
          break
        case 'RUNNING':
          cls = 'text-primary'
          icon = 'fa fa-play-circle-o'
          break
        case 'WAITING':
          cls = 'text-default'
          icon = 'fa fa-clock-o'
          break
        case 'QUEUED':
          cls = 'text-default'
          icon = 'fa fa-stack-overflow'
          break
      }
      if (node.level === 1) {
        checkbox = <el-checkbox onChange={() => this.check(data.id)} name={node.label}></el-checkbox>
      }

      const duration = data.duration ? `${data.duration} seconds` : ''

      let link

      if (data.type === 'TaskLog') {
        link = <router-link to={'sessions/task-log/' + data.globalId}>{node.label}</router-link>
      } else {
        link = node.label
      }

      return (
        <span>
          {checkbox}
          &nbsp;&nbsp;
          <span class={cls} data-toggle="tooltip" title={data.status}><i class={icon} aria-hidden="true"></i></span>
          <span>
            <span>&nbsp;&nbsp;{link}</span>
          </span>
          <span style="float:right; padding-right:20px; margin:0 auto;">
            <span Class="duration">{duration}</span>
          </span>
        </span>)
    },
    filterSessions (value, data) {
      if (!value) return true
      return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  },
  mounted () {
  },
  components: {
    Form,
    Tree,
    Slider
  }
}
</script>

<style>

  .agent .el-select {
    width:100%;
  }

  .tree-grid {
    border: 0px !important
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

  .duration {
    color: #212121;
    opacity: 0.6;
  }

  .el-input__icon {
    line-height: 20px;
  }
  .el-input__inner {
    border-radius: 2px;
    line-height: inherit;
    height: 20px;
    border: none;
  }
  .el-input {
    top: 4px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 150px;
  }

</style>
