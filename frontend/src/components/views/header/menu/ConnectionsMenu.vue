<template lang="pug">
li.dropdown.notifications-menu
  a.dropdown-toggle(href='javascript:;', data-toggle='dropdown')
    i.fa.fa-th
  ul.dropdown-menu
    li(v-if='connections.length > 0')
      ul.menu(v-for="m in connections")
        li
          a(href='javascript:;' @click="setConnection(m.id)" )
            i.fa.fa-plug.text-gray
            |  {{m.name}}
    li.footer(v-if='connections.length > 0')
      router-link(to="connections" ) View all
    li.footer(v-else='')
      a(href='javascript:;') 
        i.fa.fa-plus 
        | Create connection

</template>

<script>

import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'ConnectionsMenu',
  props: {
    valueField: String,
    displayField: String,
    label: String,
    button: Object,
    button2Click: Function
  },
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters('connections', [
      'connections'
    ])
  },
  methods: {
    ...mapActions([
      'setConnection'
    ])
  },
  mounted () {
  }
}
</script>


<style>

</style>

