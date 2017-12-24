<template lang="pug">
.col-md-8.col-md-offset-2(v-if="users.length > 0")
  .box(style="border-top=0px")
    .box-header.with-border
      h3.box-title {{title}}
      .box-tools.pull-right
        .has-feedback.table-search
          input.form-control.input-sm.search-box(v-model="filter", type='text', placeholder='Search')
    .box-body.no-padding
      .table-controls
        a.btn.btn-default.btn-sm.js-reload-btn(@click='findUsers' type='button', data-toggle="tooltip" title="Reload",)
          i.fa.fa-refresh.text-blue.fa-lg
        router-link.js-item.js-new-plan.btn.btn-default.btn-sm(to='/users/new',data-toggle="tooltip" title="New",)
          i.fa.fa-plus.text-green.fa-lg
        router-link.js-item.btn.btn-default.btn-sm.js-import-btn(to='/users/import' data-toggle="tooltip" title="Import")
          i.fa.fa-upload.text-yellow.fa-lg
        a.js-trash-btn.btn.btn-default.btn-sm(@click="deleteUser(selected[0])", data-toggle="tooltip" title="Delete", :class="selected.length > 0 ? '':'hidden'")
          i.fa.fa-trash-o.text-danger.fa-lg
        a.js-export-btn.btn.btn-default.btn-sm(@click="exportUser", data-toggle="tooltip" title="Export", :class="selected.length > 0 ? '':'hidden'")
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
              td 
                router-link(:to="'users/' + m.id" ) {{m.name}}
              td {{m.email}}
              td {{m.role}}
    .box-footer.clearfix
      ul.pagination.pagination-sm.no-margin.pull-right  
        el-pagination(@current-change="pageChange" layout='prev, pager, next', :total="total", :page-size="pageSize")    
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Users',
  data () {
    return {
      title: 'Users',
      selected: [],
      pageSize: 10,
      currentPage: 1,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('users', [
      'users'
    ]),
    total () {
      if (_.isEmpty(this.filter)) {
        return this.users.length
      }
      const users = _.filter(this.users, user => {
        return user.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
      })
      return users.length
    },
    collection () {
      let users = this.users
      if (!_.isEmpty(this.filter)) {
        users = _.filter(this.users, user => {
          return user.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        })
      }
      const i = (this.currentPage - 1) * this.pageSize
      return _.slice(users, i, i + this.pageSize)
    }
  },
  watch: {
    selected: function () {
      if (this.selected.length > 1) {
        this.selected.splice(0, 1)
      }
    },
    users: function () {
      this.selected = []
    }
  },
  methods: {
    ...mapActions('users', [
      'deleteUser',
      'findUsers'
    ]),
    exportUser () {
      const id = this.selected[0]
      window.location = `api/v1/users/export/${id}`
    },
    pageChange (p) {
      this.currentPage = p
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
