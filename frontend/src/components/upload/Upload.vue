<template lang="pug">

section.content
    .row
      .col-md-6.col-md-offset-3  
        .box.box-primary
          .box-header.with-border
            h3.box-title {{title}}
          form(role='form')
            .box-body  
              el-upload.upload-demo(ref='upload', :action="action", :auto-upload='false' multiple=false :limit='1')
                el-button(slot='trigger', size='small', type='primary') Select file
                el-button(style='margin-left: 10px;', size='small', type='success', @click='upload') Upload to server
                .el-upload__tip(slot='tip') alchemist json files or exported odi xml and zip files only!

</template>

<script>
// import moment from 'moment'
// import { mapActions, mapGetters } from 'vuex'
// import _ from 'lodash'

export default {
  name: 'Upload',
  data () {
    return {
      title: 'Import',
      selected: [],
      pageSize: 10,
      currentPage: 1,
      filter: ''
    }
  },
  computed: {
    action () {
      const connectionId = 30
      return `api/v1/connections/${connectionId}/transfers/import`
    }
  },
  watch: {
  },
  methods: {
    upload () {
      this.$refs.upload.submit()
    }
  },
  mounted () {
  }
}
</script>
<style>
input[type="file"] {
  display: none;
}
</style>

