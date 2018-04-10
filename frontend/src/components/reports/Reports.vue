<template lang='pug'>
.row
  .col-md-4.col-md-offset-1
    .box.box-primary
      .box-header.with-border
        h3.box-title Plan tasks
      div#plan-tasks-pie(style='text-align:center;')
  .col-md-4.col-md-offset-1
    .box.box-primary
      .box-header.with-border
        h3.box-title User tasks
      div#user-tasks-pie(style='text-align:center;')

</template>

<script>

import _ from 'lodash'
import {mapGetters} from 'vuex'
import {bb} from 'billboard.js'

import 'billboard.js/dist/billboard.min.css'

export default {
  name: 'Reports',
  data () {
    return {
    }
  },
  methods: {
    close () {
      window.history.back()
    },
    drawPlanTasks () {
      let columns = _.map(this.plans, p => [p.name, p.stats.taskCount])
      let taskCount = this.taskCount
      bb.generate({
        data: {
          columns: columns,
          type: 'donut',
          onover: function (d, i) {
            document.querySelector('#plan-tasks-pie .bb-chart-arcs-title').innerHTML = d.value
          },
          onout: function (d, i) {
            document.querySelector('#plan-tasks-pie .bb-chart-arcs-title').innerHTML = (
              `<tspan>Plan Task Count</tspan>
               <tspan x="0" dy="15">${taskCount}</tspan>`
            )
          }
        },
        donut: {
          title: `Plan Task Count\n${taskCount}`
        },
        bindto: '#plan-tasks-pie'
      })
    },
    drawUserTasks () {
      let columns = _.map(this.users, p => [p.name, p.stats.taskCount])
      let taskCount = this.taskCount
      bb.generate({
        data: {
          columns: columns,
          type: 'donut',
          onover: function (d, i) {
            document.querySelector('#user-tasks-pie .bb-chart-arcs-title').innerHTML = d.value
          },
          onout: function (d, i) {
            document.querySelector('#user-tasks-pie .bb-chart-arcs-title').innerHTML = (
              `<tspan>User Task Count</tspan>
               <tspan x="0" dy="15"">${taskCount}</tspan>`
            )
          }
        },
        donut: {
          title: `User Task Count\n${taskCount}`
        },
        bindto: '#user-tasks-pie'
      })
    }
  },
  computed: {
    ...mapGetters('plans', [
      'plans'
    ]),
    ...mapGetters('users', [
      'users'
    ]),
    taskCount () {
      return _.reduce(this.plans, (s, p) => { s += p.stats.taskCount; return s }, 0)
    }
  },
  mounted () {
    this.drawPlanTasks()
    this.drawUserTasks()
  }
}
</script>

<style scoped>

.pie {
  margin: 20px;
}

.pie text {
  font-family: 'Verdana';
  fill: #888;
}

.pie .name-text{
  font-size: 1em;
}

.pie .value-text{
  font-size: 3em;
}

.bb-chart-arcs-title {
  font-weight: 900 !important;
}

</style>
