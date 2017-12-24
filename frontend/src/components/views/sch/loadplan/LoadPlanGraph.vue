<template lang="pug">
.row
  .col-md-10.col-md-offset-1  
    .box.box-primary
      .box-header.with-border
        h3.box-title {{title}}
      .box-body

      .box-footer
        a.btn.btn-danger(v-on:click="close") Close
</template>

<script>

import * as d3 from 'd3'
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  name: 'LoadPlanGraph',
  props: ['id'],
  data () {
    return {
      tree: null,
      title: 'Load Plan Graph',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      context: {
        name: '',
        agents: [],
        schemas: []
      },
      selected: [],
      switches: {},
      activeNameTab: 'steps'
    }
  },
  watch: {
  },
  methods: {
    init () {
      // Set the dimensions and margins of the diagram
      const margin = {
        top: 20,
        right: 90,
        bottom: 30,
        left: 110
      }
      let width = 1160 - margin.left - margin.right
      let height = 500 - margin.top - margin.bottom
      let treeData = this.loadPlan.rootStep
      treeData.name = this.loadPlan.name

      // append the svg object to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      let svg = d3.select('.box-body').append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .call(d3.zoom().on('zoom', function () {
          svg.attr('transform', d3.event.transform)
        }))
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // svg.append('rect')
      //   .attr('width', width + margin.right + margin.left)
      //   .attr('height', height + margin.top + margin.bottom)
      //   .style('fill', 'none')
      //   .style('pointer-events', 'all')

      let i = 0
      let duration = 750
      let root

      // declares a tree layout and assigns the size
      let treemap = d3.tree().size([height, width])

      // Assigns parent, children, height, depth
      root = d3.hierarchy(treeData, d => { return d.childrenSteps })
      root.x0 = height / 2
      root.y0 = 0

      // Collapse the node and all it's children
      const collapse = (d) => {
        if (d.children) {
          d._children = d.children
          d._children.forEach(collapse)
          d.children = null
        }
      }
      root.children.forEach(collapse)
      // Creates a curved (diagonal) path from parent to the child nodes
      const diagonal = (s, d) => {
        let path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`
        return path
      }

      const update = (source) => {
        // Toggle children on click.
        const click = (d) => {
          if (d.children) {
            d._children = d.children
            d.children = null
          } else {
            d.children = d._children
            d._children = null
          }
          update(d)
        }

        // Assigns the x and y position for the nodes
        let treeData = treemap(root)
        // Compute the new tree layout.
        let nodes = treeData.descendants()
        let links = treeData.descendants().slice(1)
        // Normalize for fixed-depth.
        nodes.forEach(d => { d.y = d.depth * 180 })

        // Update the nodes...
        let node = svg.selectAll('g.node')
          .data(nodes, d => { return d.id || (d.id = ++i) })

        // Enter any new modes at the parent's previous position.
        let nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => {
              return `translate( ${source.y0}, ${source.x0})`
            })
            .on('click', click)

          // Add Circle for the nodes
        nodeEnter.append('circle')
          .attr('class', 'node')
          .attr('r', 1e-6)
          .style('fill', d => { return d._children ? 'lightsteelblue' : '#fff' })

          // Add labels for the nodes
        nodeEnter.append('text')
          .attr('dy', '.35em')
          .attr('x', d => {
            return d.children || d._children ? -13 : 13
          })
          .attr('text-anchor', d => {
            return d.children || d._children ? 'end' : 'start'
          }).text(d => { return d.data.name })

          // UPDATE
        let nodeUpdate = nodeEnter.merge(node)

        // Transition to the proper position for the node
        nodeUpdate.transition()
          .duration(duration)
          .attr('transform', d => { return `translate(${d.y} , ${d.x})` })

        // Update the node attributes and style
        nodeUpdate.select('circle.node')
          .attr('r', 10)
          .style('fill', d => {
            return d._children ? 'lightsteelblue' : '#fff'
          }).attr('cursor', 'pointer')

        // Remove any exiting nodes
        let nodeExit = node.exit().transition()
          .duration(duration)
          .attr('transform', d => {
            return `translate(${source.y}, ${source.x})`
          }).remove()

        // On exit reduce the node circles size to 0
        nodeExit.select('circle').attr('r', 1e-6)

          // On exit reduce the opacity of text labels
        nodeExit.select('text').style('fill-opacity', 1e-6)

        // ****************** links section ***************************

        // Update the links...
        let link = svg.selectAll('path.link').data(links, d => { return d.id })

        // Enter any new links at the parent's previous position.
        let linkEnter = link.enter().insert('path', 'g')
          .attr('class', 'link')
          .attr('d', d => {
            let o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
          })

        // UPDATE
        let linkUpdate = linkEnter.merge(link)

        // Transition back to the parent element position
        linkUpdate.transition()
          .duration(duration)
          .attr('d', d => { return diagonal(d, d.parent) })

        // Remove any exiting links
        link.exit().transition()
          .duration(duration)
          .attr('d', d => {
            const o = {x: source.x, y: source.y}
            return diagonal(o, o)
          }).remove()

        // Store the old positions for transition.
        nodes.forEach(d => {
          d.x0 = d.x
          d.y0 = d.y
        })
      }

      update(root)
    },
    close () {
      window.history.back()
    }
  },
  computed: {
    ...mapGetters('sch', [
      'scenarioFolders'
    ]),
    ...mapGetters('arch', [
      'contexts'
    ]),
    loadPlan () {
      const id = parseInt(this.id)
      const findLoadPlan = (node) => {
        let lp
        lp = _.find(node.loadPlans, {internalId: id})
        if (lp) {
          return lp
        } else {
          _.each(node.subFolders, folder => {
            const res = findLoadPlan(folder)
            if (res) {
              lp = res
            }
          })
        }
        return lp
      }
      return _.cloneDeep(findLoadPlan(this.scenarioFolders))
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  components: {
  }
}
</script>

<style>

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
