<template lang="pug">
.row
  .col-md-8.col-md-offset-2(v-if="filter.length > 0 || collection.length > 0")
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
          router-link.btn.btn-default.btn-sm(to='/group',data-toggle="tooltip" title="New",)
            i.fa.fa-plus.text-green.fa-lg
          router-link.btn.btn-default.btn-sm(to='/import' data-toggle="tooltip" title="Import")
            i.fa.fa-upload.text-yellow.fa-lg
          a.btn.btn-default.btn-sm(@click="onDelete", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
            i.fa.fa-trash-o.text-danger.fa-lg
          a.btn.btn-default.btn-sm(data-toggle="tooltip" title="Export group" :class="selected.length > 0 ? '':'hidden'")
            i.fa.fa-download.text-green.fa-lg  

        .table-responsive.connection-items
          table.table.table-hover
            tbody
              tr(v-for="m in collection")
                td(style="width:20px")
                  label.el-checkbox
                    span.el-checkbox__input(:class="selected.indexOf(m.id)>-1 ? 'is-checked':''")
                      span.el-checkbox__inner
                      input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.id')  
                td(style="width:20px")
                  div(:style="`border-radius:0px;width:14px;height:14px;background-color:${m.color}`")
                td 
                  router-link(:to="'group/' + m.id" ) {{m.name}}
                td 
                  span {{m.parallel}} parallel
                td 
                  span {{priority(m.priority)}}
              

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
  .align-center(v-if="collection.length === 0 && filter.length === 0")
    div.no-connection(style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
      div(style="width:100%; display: inline-block;")
        i.fa.big-icon.text-gray-harbor.fa-cubes(style="text-align: center;")
      div(style="width:100%; margin-top: 20px;display: inline-block;")
        span.text-gray-harbor(style="font-size:20px;") You do not have any groups !  
</template>

<script>

import _ from 'lodash'
import {mapGetters, mapActions} from 'vuex'

export default {
  data () {
    return {
      title: 'Groups',
      selected: [],
      pageSize: 10,
      pagination: {currentPage: 1},
      maxPaginationSize: 7,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('groups', [
      'groups'
    ]),
    total () {
      return this.groups.length
    },
    collection () {
      if (_.isEmpty(this.filter)) {
        return this.groups
      }
      return _.filter(this.groups, (g) =>
        g.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1)
    }
  },
  watch: {
    selected: function () {
      if (this.selected.length > 1) {
        this.selected.splice(0, 1)
      }
    },
    groups: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('groups', [
      'findAll',
      'remove'
    ]),
    priority (p) {
      switch (p) {
        case 1: return 'Low priority'
        case 2: return 'Medium priority'
        case 3: return 'High priority'
        case 4: return 'Top priority'
      }
    },
    onDelete () {
      const id = this.selected[0]
      const g = _.find(this.groups, {id})
      const message = `Are you sure? This will also delete tasks with the primary group ${g.name}`
      const options = {
        loader: true,
        okText: 'Delete',
        cancelText: 'Close',
        type: 'hard',
        verification: g.name
      }
      this.$dialog.confirm(message, options).then((d) => {
        this.remove(id).finally(() => {
          d.close()
        })
      })
    }
  }
}
</script>

<style lang="css">

.dg-content-footer,
.dg-form {
  background-color: white !important;
  border: none !important;
}

</style>
