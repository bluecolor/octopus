<template lang="pug">
  section.content
    .row
      .col-md-3.col-sm-6.col-xs-12
        .info-box
          span.info-box-icon.bg-aqua
            i.ion.ion-ios-pulse-strong
          .info-box-content
            span.info-box-text Running Steps
            span.info-box-number 16
      .col-md-3.col-sm-6.col-xs-12
        .info-box
          span.info-box-icon.bg-red
            i.ion.ion-alert
          .info-box-content
            span.info-box-text Errors
            span.info-box-number 4
      .clearfix.visible-sm-block
      .col-md-3.col-sm-6.col-xs-12
        .info-box
          span.info-box-icon.bg-green
            i.ion.ion-checkmark
          .info-box-content
            span.info-box-text Success
            span.info-box-number 760
      .col-md-3.col-sm-6.col-xs-12
        .info-box
          span.info-box-icon.bg-yellow
            i.ion.ion-alert-circled
          .info-box-content
            span.info-box-text Warning
            span.info-box-number 21

</template>

<script>
// import Chart from 'chart.js'

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
    coPilotNumbers () {
      return this.generateRandomNumbers(12, 1000000, 10000)
    },
    personalNumbers () {
      return this.generateRandomNumbers(12, 1000000, 10000)
    },
    isMobile () {
      return (window.innerWidth <= 800 && window.innerHeight <= 600)
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
