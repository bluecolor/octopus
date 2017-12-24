<template lang="pug">
  section.content
    .row
      .col-md-6.col-md-offset-3
        .box.box-primary
          .box-header.with-border
            h3.box-title {{title}}
          form(role='form')
            .box-body(style="min-height: 400px")
              .form-group
                label Name
                input.form-control(v-model="logicalSchema.name" v-validate.initial="'required'", placeholder='', required=true, autofocus=true)
              .table-responsive.connection-items
                table.table.table-hover
                  tbody
                    tr(v-for="ctx in contexts")
                      td(data-toggle="tooltip" title="Context") {{ctx.name}}
                      td(data-toggle="tooltip" title="Physical schema")
                        select.form-control.schema-selection(v-model='selected[ctx.name]')
                          option(v-for='s in physicalSchemas', v-bind:value='s.internalId')
                            | {{ s.name }}
          .box-footer
            a.btn.btn-danger(v-on:click="close") Close
            a.ladda-button.btn.btn-primary.pull-right(:disabled="hasErrors", @click="save" data-style="expand-left") Save
</template>

<script>

import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LogicalSchema',
  props: ['technologyId', 'logicalSchemaId', 'cloneFrom'],
  data () {
    return {
      title: 'Logical Schema',
      selected: {
      },
      logicalSchema: {
        name: 'LS_',
        schemaContext: []
      }
    }
  },
  methods: {
    save: function () {
      _.forOwn(this.selected, (v, k) => {
        const context = _.find(this.contexts, {name: k})
        const physicalSchema = _.find(this.physicalSchemas, {internalId: v})
        this.logicalSchema.schemaContext.push([context, physicalSchema])
      })
      if (this.id) {
        this.updateLogicalSchema(this.logicalSchema)
      } else {
        this.createLogicalSchema(this.logicalSchema)
      }
    },
    close: function () {
      window.history.back()
    },
    ...mapActions('arch', [
      'updateLogicalSchema',
      'createLogicalSchema'
    ]),
    setValues () {
      const i = this.id | this.cloneFrom
      if (!i) {
        return
      }
      this.agent = _.chain(this.logicalSchemas)
        .find({internalId: parseInt(i)})
        .cloneDeep()
        .value()
      _.forEach(this.logicalSchema.schemaContext, sc => {
        this.selected[sc[0].name] = sc[1].internalId
      })
    }
  },
  computed: {
    ...mapGetters('arch', [
      'technologies',
      'logicalSchemas',
      'physicalSchemas',
      'contexts'
    ]),
    physicalSchemas () {
      const technologyId = parseInt(this.technologyId)
      const dataServers = _.chain(this.technologies)
        .find({internalId: technologyId})
        .dataServers
      if (!dataServers) {
        return
      }
      return _.chain(dataServers)
        .map(dataServer => dataServer.physicalSchemas)
        .flatten()
        .value()
    },
    hasErrors () {
      return this.errors.all().length > 0
    }
  },
  watch: {
  },
  mounted () {
    this.setValues()
  },
  components: {
  }
}
</script>

<style>
  .schema-selection:focus,
  .schema-selection {
    background-color: inherit;
    padding: 0px;
    height: inherit;
    border-color: transparent;
  }
</style>
