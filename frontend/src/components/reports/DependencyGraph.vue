<template lang='pug'>
.row#graph

</template>

<script>

import _ from 'lodash'
import * as d3 from 'd3'
import {mapActions} from 'vuex'

export default {
  name: 'Reports',
  props: ['id'],
  data () {
    return {
    }
  },
  methods: {
    ...mapActions('tasks', [
      'findOne'
    ]),
    close () {
      window.history.back()
    },
    draw () {
      const id = parseInt(this.id)
      let margin = {top: 20, right: 90, bottom: 30, left: 90}
      let width = 960 - margin.left - margin.right
      let height = 500 - margin.top - margin.bottom
      let svg = d3.select("body").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)
      let i = 0
      let duration = 750
      let root
      let treemap = d3.tree().size([height, width])

      const collapse = (d) => {
        if(d.children) {
          d._children = d.children
          _.each(d._children, collapse)
          d.children = null
        }
      }

      this.findOne(id).then(task => {
        if (_.isEmpty(task)) return

        root = d3.hierarchy(task, d => d.dependencies)
        root.x0 = height / 2
        root.y0 = 0
        _.each(root.children, collapse)

        const update = (source) => {
          let treeData = treemap(root)
          let nodes = treeData.descendants()
          let links = treeData.descendants().slice(1)
          _.each(nodes, d => {d.y = d.depth * 180})
          let node = svg.selectAll('g.node').data(nodes, d => (d.id || (d.id = ++i)))
          let nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", d => `translate(${source.y0}, ${source.x0})`)
            .on('click', click)

          nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 1e-6)
            .style("fill", d => (d._children ? 'lightsteelblue' : '#fff'))

          nodeEnter.append('text')
            .attr('dy', '.35em')
            .attr('x', (d => d.children || d._children ? -13 : 13))
            .attr('text-anchor', d => (d.children || d._children ? 'end' : 'start'))
            .text(d => d.data.name)

          let nodeUpdate = nodeEnter.merge(node);

          nodeUpdate.transition()
            .duration(duration)
            .attr("transform", d =>  `translate(${d.y}, ${d.x})`)

          nodeUpdate.select('circle.node')
            .attr('r', 10)
            .style("fill", d => (d._children ? 'lightsteelblue' : '#fff'))
            .attr('cursor', 'pointer')

          let nodeExit = node.exit().transition()
            .duration(duration)
            .attr('transform', d =>`translate(${source.y}, ${source.x})`)
            .remove()

          nodeExit.select('circle').attr('r', 1e-6)
          nodeExit.select('text').style('fill-opacity', 1e-6)

          let link = svg.selectAll('path.link').data(links, d => d.id)

          let linkEnter = link.enter().insert('path', "g")
            .attr('class', 'link')
            .attr('d', (d) => { let o = {x: source.x0, y: source.y0}; return diagonal(o, o) })

          linkUpdate.transition().duration(duration).attr('d', d => diagonal(d, d.parent))

          let linkExit = link.exit().transition()
            .duration(duration)
            .attr('d', d => { let o = {x: source.x, y: source.y}; return diagonal(o, o) })
            .remove()

          _.each(nodes, d => { d.x0 = d.x; d.y0 = d.y})

          function diagonal (s, d) {
            path = `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                      ${(s.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x}`
            return path
          }
          function click (d) {
            if (d.children) {
              d._children = d.children
              d.children = null
            } else {
              d.children = d._children
              d._children = null
            }
            update(d)
          }

        }

        update(root)
      })
    }
  },
  computed: {
  },
  mounted () {
    this.draw()
  }
}
</script>

<style scoped>
.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 3px;
}

.node text {
  font: 12px sans-serif;
}

.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}
</style>
