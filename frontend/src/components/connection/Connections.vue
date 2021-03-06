<template lang="pug">
.col-md-8.col-md-offset-2(v-if="connections.length > 0")
  .box.box-primary(style="border-top=0px")
    .box-header.with-border
      h3.box-title {{title}}
      .box-tools.pull-right
        .has-feedback.table-search
          input.form-control.input-sm.search-box(autofocus=true, v-model="filter" type='text', placeholder='Search')
    .box-body.no-padding
      .table-controls
        a.btn.btn-default.btn-sm(@click='findConnections' type='button', data-toggle="tooltip" title="Reload")
          i.fa.fa-refresh.text-blue.fa-lg
        router-link.btn.btn-default.btn-sm(to='/connection',data-toggle="tooltip" title="New",)
          i.fa.fa-plus.text-green.fa-lg
        router-link.btn.btn-default.btn-sm(to='/connections/import' data-toggle="tooltip" title="Import")
          i.fa.fa-upload.text-yellow.fa-lg
        a.btn.btn-default.btn-sm(@click="onDelete", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-trash-o.text-danger.fa-lg
        a.btn.btn-default.btn-sm(@click="test", data-toggle="tooltip" title="Test", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-flask.text-yellow.fa-lg
        a.btn.btn-default.btn-sm(@click="exportConnection", data-toggle="tooltip" title="Export", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-download.text-green.fa-lg
        router-link.btn.btn-default.btn-sm(:to="'connection/' + selected[0] + '?clone=true'", data-toggle="tooltip" title="Clone", :class="selected.length == 1 ? '':'hidden'")
          i.fa.fa-clone.text-primary.fa-lg

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
                router-link(:to="'connection/' + m.id" ) {{m.name}}
              td(style="text-align:left") 
                span(title="Connection type") {{m.connectionType}}
              td(style="text-align:left") 
                span(title="Destination") {{destination(m)}}
              td(style="text-align:left")
                span(title="Username") {{m.username}}
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
      i.fa.big-icon.text-gray-harbor.fa-plug(style="text-align: center;")
    div(style="width:100%; margin-top: 20px;display: inline-block;")
      span.text-gray-harbor(style="font-size:20px;") You do not have any connection yet !  
    div(style="width:70%; margin-top: 20px;display: inline-block;")
      router-link.btn.btn-block.btn-primary.btn-lg(to='connection') Create Connection

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'Connections',
  data () {
    return {
      title: 'Connections',
      selected: [],
      pageSize: 10,
      pagination: {currentPage: 1},
      maxPaginationSize: 7,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('connections', [
      'connections'
    ]),
    total () {
      if (_.isEmpty(this.filter)) {
        return this.connections.length
      }
      const connections = _.filter(this.connections, connection => {
        return connection.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      })
      return connections.length
    },
    collection () {
      let connections = this.connections
      if (!_.isEmpty(this.filter)) {
        connections = _.filter(this.connections, connection => {
          return connection.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        })
      }
      const i = (this.pagination.currentPage - 1) * this.pageSize
      return _.slice(connections, i, i + this.pageSize)
    }
  },
  watch: {
    selected: function () {
      if (this.selected.length > 1) {
        this.selected.splice(0, 1)
      }
    },
    connections: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('connections', {
      deleteConnection: 'remove',
      findConnections: 'findAll',
      testConnection: 'test'
    }),
    pageChange (p) {
      this.currentPage = p
    },
    test () {
      const id = this.selected[0]
      const connection = _.find(this.connections, {id})
      this.testConnection(connection)
    },
    exportConnection () {
      const id = this.selected[0]
      window.location = `api/v1/connections/export/${id}`
    },
    onDelete () {
      const id = this.selected[0]
      const c = _.find(this.connections, {id})
      const message = `Are you sure? This may cause connection problems!`
      const options = {
        loader: true,
        okText: 'Delete',
        cancelText: 'Close',
        type: 'hard',
        verification: c.name
      }
      this.$dialog.confirm(message, options).then((d) => {
        this.deleteConnection(id).finally(() => {
          d.close()
        })
      })
    },
    destination (c) {
      switch (c.connectionType) {
        case 'SSH': return c.host
        case 'LOCAL': return 'localhost'
        case 'JDBC': return c.jdbcUrl
      }
    }
  },
  mounted () {
  }
}
</script>

<style>
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

</style>
