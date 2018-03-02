<template lang="pug">

.form-group.input-group.combo  
  label {{label}} 
  select.form-control(style='border-radius:0px; width:100%', v-model="value")
    option(v-for="r in records" :value="r[valueField]") {{r[displayField]}}
  span.input-group-btn(style='vertical-align:bottom' :class="button && button.clear ? '': 'hidden'")
    a.btn.btn-default.combo-action(type='button', tabindex='-1', href='javascript:void(0)')
      span.fa.fa-eraser.text-danger(aria-hidden='true')    
  span.input-group-btn(style='vertical-align:bottom')
    a.btn.btn-default(:disabled="button2Disabled" type='button', tabindex='-1', @click="button2Click()", href='javascript:void(0)')
      span.fa.text-success(:class="button && button.cls ? button.cls : 'fa-plus' " aria-hidden='true')    

</template>

<script>
export default {
  name: 'Combo',
  props: {
    valueField: String,
    displayField: String,
    label: String,
    button: Object,
    button2Click: Function,
    button2Disabled: Boolean
  },
  data () {
    return {
      value: null,
      response: null,
      error: null,
      records: []
    }
  },
  watch: {
    value: function (n) {
      this.$emit('update:value', n)
    }
  },
  computed: {
  },
  methods: {
    loadData: function (data) {
      this.records = data
    },
    setValue (v) {
      this.value = v
    }
  },
  mounted () {

  }
}
</script>


<style>

.combo {
  width: 100%; 
}
.combo .combo-action {
  border-radius: 0px;
  border-left: 0px; 
}
</style>

