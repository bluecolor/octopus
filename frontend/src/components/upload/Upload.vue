<template lang="pug">

section.content
    .row
      .col-md-6.col-md-offset-3  
        .box.box-primary
          .box-header.with-border
            h3.box-title {{title}}
          form(role='form')
            .box-body
              el-upload.upload-demo(:file-list="files" ref='upload', action="api/v1/import", :auto-upload='false' multiple=false :limit='1')
                el-button(:disabled="files.length > 0" slot='trigger', size='small', type='primary') Select file
                el-button(style='margin-left: 10px;', size='small', type='success', @click='upload') Upload to server
                .el-upload__tip(slot='tip') alchemist json files or exported odi xml and zip files only!

</template>

<script>
// import moment from 'moment'
// import { mapActions, mapGetters } from 'vuex'
// import _ from 'lodash'
import {Upload, Button} from 'element-ui'

export default {
  name: 'Upload',
  data () {
    return {
      title: 'Import',
      files: []
    }
  },
  computed: {
  },
  watch: {
    files () {
      console.log('asdsa')
    }
  },
  methods: {
    upload () {
      this.$refs.upload.submit()
    }
  },
  mounted () {
  },
  components: {
    'el-upload': Upload,
    'el-button': Button
  }
}
</script>
<style>
input[type="file"] {
  display: none;
}
</style>

