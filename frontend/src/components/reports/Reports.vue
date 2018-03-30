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
import * as d3 from 'd3'
import {mapGetters} from 'vuex'

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
    donut () {
    },
    initPlanTasksPie () {
      let data = _.cloneDeep(this.plans)
      let width = 260
      let height = 260
      let thickness = 40
      let radius = Math.min(width, height) / 2
      let color = d3.scaleOrdinal(d3.schemeCategory10)

      // console.log(data)
      var svg = d3.select('#plan-tasks-pie')
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height)

      let g = svg.append('g')
        .attr('transform', `translate( ${width / 2}, ${height / 2})`)

      let arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius)

      let pie = d3.pie().value(d => d.stats.taskCount).sort(null)

      g.selectAll('path')
        .data(pie(data))
        .enter()
        .append('g')
        .on('mouseover', function (d) {
          let g = d3.select(this)
            .style('cursor', 'pointer')
            .style('fill', 'black')
            .append('g')
            .attr('class', 'text-group')
          g.append('text')
            .attr('class', 'name-text')
            .text(`${d.data.name}`)
            .attr('text-anchor', 'middle')
            .attr('dy', '-1.2em')

          g.append('text')
            .attr('class', 'value-text')
            .text(`${d.data.stats.taskCount}`)
            .attr('text-anchor', 'middle')
            .attr('dy', '.6em')
        })
        .on('mouseout', function (d) {
          d3.select(this)
            .style('cursor', 'none')
            .style('fill', color(this._current))
            .select('.text-group').remove()
        })
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i))
        .on('mouseover', function (d) {
          d3.select(this)
            .style('cursor', 'pointer')
            .style('fill', 'black')
        })
        .on('mouseout', function (d) {
          d3.select(this)
            .style('cursor', 'none')
            .style('fill', color(this._current))
        })
        .each(function (d, i) { this._current = i })

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text('')
    }
  },
  computed: {
    ...mapGetters('plans', [
      'plans'
    ])
  },
  mounted () {
    this.initPlanTasksPie()
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
</style>
