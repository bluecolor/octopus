<template lang="pug">
  aside.main-sidebar
    section.sidebar
      sidebar-menu
</template>
<script>
import SidebarMenu from './SidebarMenu'

export default {
  name: 'Sidebar',
  props: ['displayName', 'pictureUrl'],
  components: { SidebarMenu }
}
</script>
<style>
  .user-panel .image img {
    border-radius: 50%;
  }
</style>
