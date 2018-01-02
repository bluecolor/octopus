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
            input.form-control(placeholder='Group name ...', required=true, autofocus=true)
          .form-group
            label Parallel
            input.form-control(v-model="group.parallel", type='number', required=false, min='1')
          .form-group
            label Priority
            div(style="min-width:400px")
              vue-slider(
                ref="slider" 
                v-model="group.priority" 
                :data=['Low', 'Medium', 'High', 'Top']
                piecewise=true 
                tooltip="hover" 
                :speed=0.2)
          .form-group
            label Color
            .input-group.colorpicker-component
              input.form-control(type='text', name='color',v-model="group.color")
              span.input-group-addon
                el-color-picker(size='mini' v-model="group.color")
          .form-group
            label Description
            textarea.form-control(name="description" rows="3")
        .box-footer
          a.btn.btn-danger(@click="close") Close
          a.disabled.ladda-button.btn.btn-primary.pull-right(data-style="expand-left") Save  
</template>

<script>
import vueSlider from 'vue-slider-component'
import {ColorPicker} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)

export default {
  data () {
    return {
      title: 'Group',
      group: {
        parallel: 20,
        priority: 1,
        color: '#69A4D4'
      }
    }
  },
  methods: {
    close () {
      window.history.back()
    }
  },
  components: {
    vueSlider,
    'el-color-picker': ColorPicker
  }
}
</script>

<style lang="scss">
.input-group-addon{
  padding: 0;
}
.el-color-picker__trigger {
  border: none !important;
}

.input-group-addon {
  line-height: 1.28;
}

</style>
