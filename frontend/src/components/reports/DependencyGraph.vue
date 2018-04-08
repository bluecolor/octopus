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
