<template lang="pug">
ul.sidebar-menu
  li.active.pageLink(v-on:click='toggleMenu')
    router-link(to='/')
      i.fa.fa-home
      span.page Home
  li.pageLink(v-on:click='toggleMenu')
    router-link(to='/sessions')
      i.fa.fa-tasks
      span.page Sessions
  li.pageLink(v-on:click='toggleMenu')
    router-link(to='/plans')
      i.fa.fa-calendar-check-o
      span Run Plans
  li.pageLink(v-on:click='toggleMenu')
    router-link(to='/tasks')
      i.fa.fa-cog
      span Tasks
  li.pageLink(v-on:click='toggleMenu')
    router-link(to='/groups')
      i.fa.fa-cubes
      span Groups
  li.pageLink(v-on:click='toggleMenu')
    router-link(to='/parameters')
      i.fa.fa-code
      span Parameters
  li.pageLink(v-on:click='toggleMenu')
    router-link(to='/connections')
      i.fa.fa-plug
      span Connections
  li.pageLink(v-on:click='toggleMenu')
    router-link(to='/users')
      i.fa.fa-users
      span Users
  li.pageLink(v-on:click='toggleMenu')
    a(href='javascript:void();')
      i.fa.fa-wrench
      span Settings
    ul.treeview-menu
      li
        router-link(to='/settings/general')
          i.fa.fa-cogs
          | General
      li
        router-link(to='/settings/mail')
          i.fa.fa-envelope-o
          | Mail
      li
        router-link(to='/settings/slack')
          i.fa.fa-slack
          | Slack
  li
    router-link(to='/reports')
      i.fa.fa-bar-chart
      span Reports
  li
    a(href="", onclick="window.location='https://github.com/bluecolor/octopus'", target="_blank")
      i.fa.fa-lg.fa-github
      span Project Home
    ul.treeview-menu
      li 
        a.js-nav-users(href='https://github.com/bluecolor/octopus/wiki', target="_blank")
          i.fa.fa-book
          span Documentation
      li 
        a.js-nav-users(href='https://github.com/bluecolor/octopus/issues', target="_blank")
          i.fa.fa-bug
          span Report an Issue

</template>
<script>
export default {
  name: 'SidebarName',
  methods: {
    toggleMenu (event) {
      // remove active from li
      var active = document.querySelector('li.pageLink.active')

      if (active) {
        active.classList.remove('active')
      }
      // window.$('li.pageLink.active').removeClass('active')
      // Add it to the item that was clicked
      event.toElement.parentElement.className = 'pageLink active'
    }
  }
}
</script>
<style>
  /* override default */
  .sidebar-menu>li>a {
    padding: 12px 15px 12px 15px;
  }

  .sidebar-menu li.active>a>.fa-angle-left, .sidebar-menu li.active>a>.pull-right-container>.fa-angle-left {
    animation-name: rotate;
    animation-duration: .2s;
    animation-fill-mode: forwards;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(-90deg);
    }
  }
</style>
