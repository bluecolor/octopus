<template lang="pug">
div(:class="['wrapper', classes]")
  header.main-header
    a.logo(href='#')
      span.logo-mini
        b O
      span.logo-lg
        b Octopus
    nav.navbar.navbar-static-top(role='navigation')
      a.sidebar-toggle(href='javascript:;', data-toggle='offcanvas', role='button')
        span.sr-only Toggle navigation
      .navbar-custom-menu
        ul.nav.navbar-nav
          li.navbar-text {{connectionName}}
          // Notifications Menu
          li.dropdown.notifications-menu
            a.dropdown-toggle(href='javascript:;', data-toggle='dropdown')
              i.fa.fa-bell-o
              span.label.label-warning {{ }}
            ul.dropdown-menu
              li.header You have {{notifications.length}} notification(s)
              li(v-if='true')
                // Inner Menu: contains the notifications
                ul.menu
                  li(v-for="n in notifications")
                    // start notification
                    a(href='javascript:;')
                      i.fa.fa-cog.text-danger
                      |  {{n.name}} crashed
                  // end notification
              li.footer(v-if='true')
                router-link(to='notifications') View all
          // User Account Menu
          li.dropdown.user.user-menu.tasks-menu
            a.dropdown-toggle(href='javascript:;', data-toggle='dropdown')
              // The user image in the navbar
              //- img.user-image(v-bind:src='demo.avatar', alt='User Image')
              // hidden-xs hides the username on small devices so only the image appears.
              span.hidden-xs {{ me.name }}
            ul.dropdown-menu
              li(v-if='true')
                ul.menu
                  li
                    router-link(to="/options" href='javascript:;')
                      i.fa.fa-sliders.text-green
                      |  Options
                  li
                    router-link(to="/change-password" href='javascript:;')
                      i.fa.fa-key.text-orange
                      |  Change password
              li.footer(v-if='true')
                a(href='javascript:;' @click="logout")
                  span(style="color:red;") Sign out
  // Left side column. contains the logo and sidebar
  sidebar(display-name='', picture-url='')
  // Content Wrapper. Contains page content
  .content-wrapper(:style="'clear:both;' + !footer ? 'min-height:740px !important;':''")
    //- toast(position='se')
    // Content Header (Page header)
    section.content-header
    router-view
  // /.content-wrapper
  // Main Footer
  footer.main-footer(v-show="footer")
    .pull-right.hidden-xs
      b Version:  
      span {{v.major}}.{{v.minor}}.{{v.code}}
      b    Build date:  
      span {{version.date}}
    strong
      | Copyright © {{year}} &nbsp;
      a(href='javascript:;') blue
      | .
    |  All rights reserved.
// ./wrapper


</template>

<script>

import _ from 'lodash'
import { mapGetters } from 'vuex'
import config from '../config'
import Sidebar from './Sidebar'
import 'hideseek'

export default {
  name: 'Dash',
  components: {
    Sidebar
  },
  data: function () {
    return {
      year: new Date().getFullYear(),
      classes: {
        fixed_layout: config.fixedLayout,
        hide_logo: config.hideLogoOnMobile
      },
      error: ''
    }
  },
  computed: {
    ...mapGetters('connections', [
      'connections'
    ]),
    ...mapGetters('app', [
      'version'
    ]),
    ...mapGetters('users', [
      'options',
      'me'
    ]),
    ...mapGetters('taskInstances', [
      'stats'
    ]),
    footer () {
      if (!_.isEmpty(this.options) && !_.isEmpty(this.options.appearance)) {
        return this.options.appearance.footer
      }
      return true
    },
    connection () {
      return _.find(this.connections, {id: this.connectionId})
    },
    connectionName () {
      if (this.connection) {
        return this.connection.name
      }
    },
    v () {
      let version = {}
      if (this.version.major) {
        version = {
          major: this.version.major.split('=')[1],
          minor: this.version.minor.split('=')[1],
          code: this.version.versionCode.split('=')[1]
        }
      }
      return version
    },
    notifications () {
      return _.take(this.stats.error, 5)
    }
  },
  methods: {
    changeloading () {
      this.$store.commit('TOGGLE_SEARCHING')
    },
    logout () {
      window.location = '/logout'
    }
  }
}
</script>

<style lang="scss">
.wrapper.fixed_layout {
  .main-header {
    position: fixed;
    width: 100%;
  }

  .content-wrapper {
    padding-top: 50px;
  }

  .main-sidebar {
    position: fixed;
    height: 100vh;
  }
}

.wrapper.hide_logo {
  @media (max-width: 767px) {
    .main-header .logo {
      display: none;
    }
  }
}

.logo-mini,
.logo-lg {
  text-align: center;
  display: inline;
}


.user-panel {
  height: 4em;
}

hr.visible-xs-block {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  height: 1px;
  border-color: transparent;
}

.navbar-text {
  color: #ffffff;
}

</style>
