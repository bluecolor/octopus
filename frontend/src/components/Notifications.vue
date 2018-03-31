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
        div(style="padding: 10px 20px 10px 20px;")
          .info-box(v-for="m in collection")
            span.info-box-icon.bg-red
              i.ion.ion-alert
            .info-box-content
              span.info-box-number {{m.name}}
              span.info-box-text {{m.name}} crashed


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
        i.fa.big-icon.text-gray-harbor.fa-exclamation(style="text-align: center;")
      div(style="width:100%; margin-top: 20px;display: inline-block;")
        span.text-gray-harbor(style="font-size:20px;") You do not have any notifications
</template>

<script>

// import _ from 'lodash'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      title: 'Notifications',
      pageSize: 10,
      pagination: {currentPage: 1},
      maxPaginationSize: 7,
      filter: ''
    }
  },
  computed: {
    ...mapGetters('taskInstances', [
      'stats'
    ]),
    collection () {
      return this.stats.error
    },
    total () {
      return this.collection.length
    }
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style lang="css">

.dg-content-footer,
.dg-form {
  background-color: white !important;
  border: none !important;
}

.info-box-content{
  text-align: inherit;
}

 .info-box-content span.info-box-text {

 }

</style>
