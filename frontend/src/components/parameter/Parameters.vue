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
        router-link.btn.btn-default.btn-sm(to='/parameter',data-toggle="tooltip" title="New",)
          i.fa.fa-plus.text-green.fa-lg
        router-link.btn.btn-default.btn-sm(to='/import' data-toggle="tooltip" title="Import")
          i.fa.fa-upload.text-yellow.fa-lg
        a.btn.btn-default.btn-sm(@click="remove(selected[0])", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-trash-o.text-danger.fa-lg
                
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
                router-link(:to="'parameter/' + m.id" ) {{m.name}}

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
      i.fa.big-icon.text-gray-harbor.fa-code(style="text-align: center;")
    div(style="width:100%; margin-top: 20px;display: inline-block;")
      span.text-gray-harbor(style="font-size:20px;") You don't have any parameter!  
    div(style="width:70%; margin-top: 20px;display: inline-block;")
      router-link.btn.btn-block.btn-primary.btn-lg(to='parameter') Create Parameter

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'Parameters',
  data () {
    return {
      title: 'Parameters',
      selected: [],
      pageSize: 10,
      pagination: {currentPage: 1},
      maxPaginationSize: 7,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('parameters', [
      'parameters'
    ]),
    total () {
      if (_.isEmpty(this.filter)) {
        return this.parameters.length
      }
      const parameters = _.filter(this.parameters, parameter => {
        return parameter.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      })
      return parameters.length
    },
    collection () {
      let parameters = this.parameters
      if (!_.isEmpty(this.filter)) {
        parameters = _.filter(this.parameters, parameter => {
          return parameter.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        })
      }
      const i = (this.pagination.currentPage - 1) * this.pageSize
      return _.slice(parameters, i, i + this.pageSize)
    }
  },
  watch: {
    selected: function () {
      if (this.selected.length > 1) {
        this.selected.splice(0, 1)
      }
    },
    parameters: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('parameters', [
      'findAll',
      'remove'
    ]),
    pageChange (p) {
      this.currentPage = p
    },
    clone () {
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

  .text-red-plum {
    color: #E57373
  }

</style>
