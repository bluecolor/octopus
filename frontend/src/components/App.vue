<template lang="pug">
  #app(:class="loading ? 'disable-bg':''")
    spinner-circle.spinner(v-show="loading")
    router-view
</template>

<script>

import {Circle as SpinnerCircle} from 'vue-loading-spinner'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      section: 'Head'
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    logout () {
      this.$store.commit('SET_USER', null)
      this.$store.commit('SET_TOKEN', null)
      if (window.localStorage) {
        window.localStorage.setItem('user', null)
        window.localStorage.setItem('token', null)
      }
      this.$router.push('/login')
    }
  },
  components: {
    SpinnerCircle
  }
}
</script>

<style>

  .mask {
    display: block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background-color:   rgba(0,0,0,0.10); */
  }

  .disable-bg {
    pointer-events: none;
  }

  .spinner-inner {
    z-index: 9999;
    transform: scale(0.8) !important;
  }

  .spinner {
    position: fixed !important;
    z-index: 999;
    height: 2em;
    width: 2em;
    overflow: show;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
</style>
