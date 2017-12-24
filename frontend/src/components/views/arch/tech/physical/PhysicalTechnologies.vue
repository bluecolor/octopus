<template lang="pug">
.col-md-8.col-md-offset-2(v-if="technologies.length > 0")
  .box(style="border-top=0px")
    .box-header.with-border
      h3.box-title {{title}}
      .box-tools.pull-right
        .has-feedback.table-search
          input.form-control.input-sm.search-box(autofocus=true, v-model="filter", type='text', placeholder='Search')
    .box-body.no-padding
      .table-controls
        a.btn.btn-default.btn-sm(@click='findTechnologies' type='button', data-toggle="tooltip" title="Reload",)
          i.fa.fa-refresh.text-blue.fa-lg
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
                router-link(:to="'physical-technology/' + m.internalId + '/data-servers'" ) {{m.name}}
              td(align="center")
                router-link(:to="'physical-technology/' + m.internalId" data-toggle="tooltip" title="Details")
                  i.fa.text-gray-harbor.fa-database          
    .box-footer.clearfix
      ul.pagination.pagination-sm.no-margin.pull-right  
        el-pagination(@current-change="pageChange" layout='prev, pager, next', :total="total", :page-size="pageSize")
.align-center(v-else)
  div.no-connection(style="width:330px; display: table-cell;vertical-align: middle;text-align: center;")
    div(style="width:100%; display: inline-block;")
      i.fa.big-icon.text-gray-harbor.fa-database(style="text-align: center;")
    div(style="width:100%; margin-top: 20px;display: inline-block;")
      span.text-gray-harbor(style="font-size:20px;") You do not have any technologies!
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'Technologies',
  data () {
    return {
      title: 'Technologies - Physical',
      selected: [],
      pageSize: 10,
      currentPage: 1,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('arch', [
      'technologies'
    ]),
    total () {
      if (_.isEmpty(this.filter)) {
        return this.technologies.length
      }
      const technologies = _.filter(this.technologies, technology => {
        return technology.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      })
      return technologies.length
    },
    collection () {
      let technologies = this.technologies
      if (!_.isEmpty(this.filter)) {
        technologies = _.filter(technologies, technology => {
          return technology.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        })
      }
      const i = (this.currentPage - 1) * this.pageSize
      return _.slice(technologies, i, i + this.pageSize)
    }
  },
  watch: {
    technologies: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('arch', [
      'findTechnologies',
      'deleteTechnology'
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
      _.each(this.selected, i => this.deleteTechnology(i))
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

</style>
