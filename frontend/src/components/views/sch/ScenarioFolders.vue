<template lang="pug">
.row
  .col-md-8.col-md-offset-2(v-if="!isEmpty")
    .box(style="border-top=0px")
      .box-header.with-border
        h3.box-title {{title}}
        .box-tools.pull-right
          .has-feedback.table-search
            input.form-control.input-sm.search-box(autofocus=true, v-model="filter" type='text', placeholder='Search')
      .box-body.no-padding
        .table-controls
          a.btn.btn-default.btn-sm(type='button', data-toggle="tooltip" title="Reload",)
            i.fa.fa-refresh.text-blue.fa-lg
          a.btn.btn-default.btn-sm(@click="remove" data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
            i.fa.fa-trash-o.text-danger.fa-lg
          a.btn.btn-default.btn-sm(@click="play" data-toggle="tooltip" title="Start", :class="selected.length > 0 ? '':'hidden'")
            i.fa.fa-play.text-success.fa-lg
          a.btn.btn-default.btn-sm(@click="exp" data-toggle="tooltip" title="Export", :class="selected.length > 0 ? '':'hidden'")
            i.fa.fa-download.text-yellow.fa-lg
          router-link.btn.btn-default.btn-sm(to="/upload" data-toggle="tooltip" title="Import")
            i.fa.fa-upload.text-red.fa-lg
          a.btn.btn-default.btn-sm(@click="deploy" data-toggle="tooltip" title="Deploy" :class="selected.length > 0 ? '':'hidden'")
            i.fa.fa-cloud-upload.text-green.fa-lg
            
        el-tree.tree-grid(
          :filter-node-method="filterNode"
          :render-content="renderContent"
          :data="collection"
          :props="defaultProps"
          show-checkbox
          node-key="globalId"
          ref='tree'
          @check-change='checkChange'
        )
        
      .box-footer.clearfix
        ul.pagination.pagination-sm.no-margin.pull-right  
          el-pagination(@current-change="pageChange" layout='prev, pager, next', :total="total", :page-size="pageSize")  
  .align-center(v-else)
    div.no-connection(style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
      div(style="width:100%; display: inline-block;")
        i.fa.big-icon.text-gray-harbor.fa-tasks(style="text-align: center;")
      div(style="width:100%; margin-top: 20px;display: inline-block;")
        span.text-gray-harbor(style="font-size:20px;") You do not have any sessions yet !  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Tree, Slider } from 'element-ui'
import _ from 'lodash'

export default {
  name: 'Sessions',
  data () {
    return {
      title: 'Scenario & Load Plan Folders',
      pageSize: 10,
      currentPage: 1,
      selected: [],
      filter: '',
      start: {
        agent: '',
        logLevel: 3
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapGetters('sch', [
      'scenarioFolders'
    ]),
    isEmpty () {
      return _.isEmpty(this.scenarioFolders.subFolders) &&
        _.isEmpty(this.scenarioFolders.loadPlans) &&
        _.isEmpty(this.scenarioFolders.scenarios)
    },
    collection () {
      let treefy = (node) => {
        node.label = node.name
        node.id = node.internalId
        node.type = 'f'
        node.children = []

        _.each(node.scenarios, (n) => {
          node.children.push({
            label: `${n.name} ${n.version}@version`,
            type: 's',
            globalId: n.globalId,
            id: n.internalId
          })
        })
        _.each(node.loadPlans, (n) => {
          node.children.push({
            label: n.name,
            type: 'l',
            globalId: n.globalId,
            id: n.internalId
          })
        })

        if (_.isEmpty(node.subFolders)) {
          return node
        }

        _.each(node.subFolders, (folder) => {
          node.children.push(treefy(folder))
        })
        return node
      }
      let root = _.cloneDeep(this.scenarioFolders)
      return treefy(root).children
    },
    total () {
      return this.collection.length
    }
  },
  watch: {
    filter (val) {
      this.$refs.tree.filter(val)
      console.log(this.collection)
    }
  },
  methods: {
    ...mapActions('transfer', [
      'doExport'
    ]),
    deploy () {
    },
    exp () {
      const nodes = this.$refs.tree.getCheckedNodes()
      let exportProps = {
        scenarios: [],
        loadPlans: [],
        folders: []
      }
      _.reduce(nodes, (result, node) => {
        switch (node.type) {
          case 'l': result.loadPlans.push(node.id); break
          case 's': result.scenarios.push(node.id); break
          case 'f': result.folders.push(node.id); break
        }
        return result
      }, exportProps)

      this.$refs.tree.setCheckedKeys([])
      this.doExport(exportProps)
    },
    checkChange (data, checked, indeterminate) {
      this.selected = this.$refs.tree.getCheckedKeys()
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
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
    renderContent (h, { node, data, store }) {
      let icon = ''
      let tooltip = ''
      let cls = ''
      switch (data.type) {
        case 'f' : icon = 'fa fa-folder'; tooltip = 'Folder'; cls = 'text-success'; break
        case 's' : icon = 'fa fa-cube'; tooltip = 'Scenario'; cls = 'text-yellow'; break
        case 'l' : icon = 'fa fa-cubes'; tooltip = 'Load plan'; cls = 'text-primary'; break
      }

      let label = ''
      if (data.type === 'l') {
        const link = `/sch/load-plan/${data.id}`
        label = <span>&nbsp;&nbsp; <router-link to={link}>{node.label}</router-link></span>
      } else if (data.type === 's') {
        const link = `/sch/scenario/${data.id}`
        label = <span>&nbsp;&nbsp; <router-link to={link}>{node.label}</router-link></span>
      } else {
        label = <span>&nbsp;&nbsp; {node.label}</span>
      }

      return (
        <span>
          <span class={cls} data-toggle="tooltip" title={tooltip}><i class={icon} aria-hidden="true"></i></span>
          <span>{label}</span>
        </span>
      )
    }
  },
  mounted () {
  },
  components: {
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

</style>
