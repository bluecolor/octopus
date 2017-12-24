<template lang="pug">
.col-md-8.col-md-offset-2(v-if="contexts.length > 0")
  .box(style="border-top=0px")
    .box-header.with-border
      h3.box-title {{title}}
      .box-tools.pull-right
        .has-feedback.table-search
          input.form-control.input-sm.search-box(type='text', placeholder='Search')
    .box-body.no-padding
      .table-controls
        a.btn.btn-default.btn-sm.js-reload-btn(@click='findAllContexts' type='button', data-toggle="tooltip" title="Reload",)
          i.fa.fa-refresh.text-blue.fa-lg
        router-link.btn.btn-default.btn-sm(to='/context',data-toggle="tooltip" title="New",)
          i.fa.fa-plus.text-green.fa-lg
        a.btn.btn-default.btn-sm(@click="remove", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-trash-o.text-danger.fa-lg
        
      .table-responsive.connection-items
        table.table.table-hover
          tbody
            tr(v-for="m in collection")
              td(style="width:20px")
                label.el-checkbox
                  span.el-checkbox__input(:class="selected.indexOf(m.internalId)>-1 ? 'is-checked':''")
                    span.el-checkbox__inner
                    input.el-checkbox__original(type='checkbox', v-model="selected" :value ='m.internalId')
              td 
                router-link(:to="'context/' + m.internalId" ) {{m.name}}
              td(:class="m.default === 1 ? 'default-text' : 'hidden'") Default
    .box-footer.clearfix
      ul.pagination.pagination-sm.no-margin.pull-right  
        el-pagination(@current-change="pageChange" layout='prev, pager, next', :total="total", :page-size="pageSize")
.align-center(v-else)
  div.no-connection(style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
    div(style="width:100%; display: inline-block;")
      i.fa.big-icon.text-gray-harbor.fa-map-signs(style="text-align: center;")
    div(style="width:100%; margin-top: 20px;display: inline-block;")
      span.text-gray-harbor(style="font-size:20px;") You do not have any contexts!
    div(style="width:70%; margin-top: 20px;display: inline-block;")
      router-link.btn.btn-block.btn-primary.btn-lg(to='contexts/') Create Context
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'Contexts',
  data () {
    return {
      title: 'Contexts',
      pageSize: 10,
      selected: [],
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters('arch', [
      'contexts'
    ]),
    total () {
      return this.contexts.length
    },
    collection () {
      const i = (this.currentPage - 1) * this.pageSize
      return _.slice(this.contexts, i, i + this.pageSize)
    }
  },
  watch: {
    selected: function () {
    },
    contexts: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('arch', [
      'findAllContexts',
      'deleteContext'
    ]),
    pageChange (p) {
      this.currentPage = p
    },
    select (id) {
      const i = this.selected.indexOf(id)
      if (i > -1) {
        this.selected.splice(i, 1)
      } else {
        this.selected.push(id)
      }
    },
    remove () {
      _.each(this.selected, contextId => {
        const context = _.find(this.contexts, {internalId: contextId})
        if (context) {
          this.deleteContext(context)
        }
      })
    }
  },
  mounted () {
  }
}
</script>

<style>

  td i {
    opacity: 0.1;
  }

  td:hover i,
  td:hover + td i {
    opacity: 1;          
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

  .default-text {
    color: #F44336;
    font-weight: bolder;
    opacity: 0.6;
  }

</style>
