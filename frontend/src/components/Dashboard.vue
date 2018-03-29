<template lang="pug">
  section.content
    .row
      .col-md-3.col-sm-6.col-xs-12
        .info-box
          span.info-box-icon.bg-aqua
            i.ion.ion-ios-pulse-strong
          .info-box-content
            span.info-box-text Running Tasks
            span.info-box-number {{taskInstanceStats.running.length}}
      .col-md-3.col-sm-6.col-xs-12
        .info-box
          span.info-box-icon.bg-red
            i.ion.ion-alert
          .info-box-content
            span.info-box-text Errors
            span.info-box-number {{taskInstanceStats.error.length}}
      .clearfix.visible-sm-block
      .col-md-3.col-sm-6.col-xs-12
        .info-box
          span.info-box-icon.bg-green
            i.fa.fa-tasks
          .info-box-content
            span.info-box-text Active Sessions
            span.info-box-number {{activeSessions}}
      .col-md-3.col-sm-6.col-xs-12
        .info-box
          span.info-box-icon.bg-yellow
            i.fa.fa-calendar-check-o
          .info-box-content
            span.info-box-text Plans
            span.info-box-number {{plans.length}}

</template>

<script>
import {mapGetters} from 'vuex'
// import _ from 'lodash'

export default {
  data () {
    return {
      generateRandomNumbers (numbers, max, min) {
        var a = []
        for (var i = 0; i < numbers; i++) {
          a.push(Math.floor(Math.random() * (max - min + 1)) + max)
        }
        return a
      }
    }
  },
  computed: {
    ...mapGetters('taskInstances', {
      'taskInstanceStats': 'stats'
    }),
    ...mapGetters('sessions', {
      'sessionStats': 'stats'
    }),
    ...mapGetters('plans', [
      'plans'
    ]),
    activeSessions () {
      return this.sessionStats.error.length + this.sessionStats.running.length
    }
  },
  mounted () {
  }
}
</script>
<style>
.info-box {
  cursor: pointer;
}
.info-box-content {
  text-align: center;
  vertical-align: middle;
  display: inherit;
}
.fullCanvas {
  width: 100%;
}
</style>
