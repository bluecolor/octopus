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
                input.form-control(v-model="agent.name" v-validate.initial="'required'", placeholder='', required=true, autofocus=true)
              .table-responsive.connection-items
                table.table.table-hover
                  tbody
                    tr(v-for="ctx in contexts")
                      td(data-toggle="tooltip" title="Context") {{ctx.name}}
                      td(data-toggle="tooltip" title="Physical agent")
                        select.form-control.agent-selection(v-model='selected[ctx.name]')
                          option(v-for='a in physicalAgents', v-bind:value='a.agentId')
                            | {{ a.name }}
          .box-footer
            a.btn.btn-danger(v-on:click="close") Close
            a.ladda-button.btn.btn-primary.pull-right(:disabled="hasErrors", @click="save" data-style="expand-left") Save
</template>

<script>

import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LogicalAgent',
  props: ['id', 'cloneFrom'],
  data () {
    return {
      title: 'Logical Agent',
      activeNameTab: 'definition',
      selected: {
      },
      agent: {
        name: 'LA_',
        agentContext: []
      }
    }
  },
  methods: {
    save: function () {
      _.forOwn(this.selected, (v, k) => {
        const context = _.find(this.contexts, {name: k})
        const physicalAgent = _.find(this.physicalAgents, {agentId: v})
        this.agent.agentContext.push([context, physicalAgent])
      })
      if (this.id) {
        this.updateLogicalAgent(this.agent)
      } else {
        this.createLogicalAgent(this.agent)
      }
    },
    close: function () {
      window.history.back()
    },
    ...mapActions('arch', [
      'updateLogicalAgent',
      'createLogicalAgent'
    ]),
    setValues () {
      const i = this.id | this.cloneFrom
      if (!i) {
        return
      }
      this.agent = _.chain(this.logicalAgents).find({agentId: parseInt(i)}).cloneDeep().value()
      _.forEach(this.agent.agentContext, ac => {
        this.selected[ac[0].name] = ac[1].agentId
      })
    }
  },
  computed: {
    ...mapGetters('arch', [
      'logicalAgents',
      'physicalAgents',
      'contexts'
    ]),
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
  .agent-selection {
    padding: 0px;
    height: inherit;
    border-color: white !important;
  }
</style>
