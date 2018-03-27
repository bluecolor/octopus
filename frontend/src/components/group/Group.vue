<template lang="pug">
.row
  .col-md-6.col-md-offset-3
    .box.box-primary
      .box-header.with-border
        h3.box-title {{title}}
      form(role='form')
        .box-body
          .form-group
            label Name
            input.form-control(v-model="group.name" placeholder='Group name ...', required=true, autofocus=true)
          .form-group
            label Parallel
            input.form-control(v-model="group.parallel", type='number', required=false, min='1')
          .form-group
            label Priority
            div(style="min-width:400px")
              vue-slider(
                ref="slider"
                v-model="group.priority"
                :data="priority"
                piecewise=true
                tooltip="hover"
                :speed=0.2)
          .form-group
            label Color
            div.input-group(style="width:100%")
              span.input-group-addon.color(:style="'width:10%;background:'+group.color+';border-color:'+group.color")
              swatches(row-length="8" v-model="group.color")
                input.form__input__element.form-control(slot="trigger" v-model="group.color"  required=false readonly)

          .form-group
            label Description
            textarea.form-control(name="description" rows="3")
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.ladda-button.btn.btn-primary.pull-right(:class="isValid?'':'disabled'" @click="onSave" data-style="expand-left") Save
</template>

<script>

import _ from 'lodash'
import {mapActions, mapGetters} from 'vuex'
import vueSlider from 'vue-slider-component'
// import {ColorPicker} from 'element-ui'
// import lang from 'element-ui/lib/locale/lang/en'
// import locale from 'element-ui/lib/locale'
// locale.use(lang)
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'

export default {
  props: ['id'],
  data () {
    return {
      title: 'Group',
      priority: ['Low', 'Medium', 'High', 'Top'],
      group: {
        name: undefined,
        parallel: 20,
        priority: 'Medium',
        color: '#69A4D4'
      }
    }
  },
  computed: {
    ...mapGetters('groups', [
      'groups'
    ]),
    isValid () {
      return (
        this.group.name &&
        this.group.parallel
      )
    }
  },
  methods: {
    ...mapActions('groups', [
      'create',
      'update'
    ]),
    close () {
      window.history.back()
    },
    init () {
      if (_.isEmpty(this.id)) {
        return
      }
      const id = parseInt(this.id)
      this.group = _.chain(this.groups).find({id}).cloneDeep().value()
      this.group.priority = this.priority[Math.max(this.group.priority, 1) - 1]
    },
    onSave () {
      this.group.priority = this.$refs.slider.getIndex() + 1
      if (_.isEmpty(this.id)) {
        this.create(this.group)
      } else {
        this.update(this.group)
      }
    }
  },
  mounted () {
    this.init()
  },
  components: {
    vueSlider,
    Swatches
  }
}
</script>

<style scoped>

.input-group-addon{
  padding: 0;
  border-radius: 0px !important;
}

.input-group-addon {
  line-height: 1.28;
}

.input-group .color{
  display: table-cell;
}

</style>
