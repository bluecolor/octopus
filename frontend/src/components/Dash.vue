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
          // Messages
          li.dropdown.messages-menu
            a.dropdown-toggle(href='javascript:;', data-toggle='dropdown')
              i.fa.fa-envelope-o
              span.label.label-success {{  }}
            ul.dropdown-menu
              li.header You have {{  }} message(s)
              li(v-if='true')
                // inner menu: contains the messages
                ul.menu
                  li
                    // start message
                    a(href='javascript:;')
                      // Message title and timestamp
                      h4
                        | Support Team
                        small
                          i.fa.fa-clock-o
                          |  5 mins
                      // The message
                      p Why not consider this a test message?
                  // end message
                // /.menu
              li.footer(v-if='true')
                a(href='javascript:;') See All Messages
          // /.messages-menu
          // Notifications Menu
          li.dropdown.notifications-menu
            a.dropdown-toggle(href='javascript:;', data-toggle='dropdown')
              i.fa.fa-bell-o
              span.label.label-warning {{ }}
            ul.dropdown-menu
              li.header You have {{ }} notification(s)
              li(v-if='true')
                // Inner Menu: contains the notifications
                ul.menu
                  li
                    // start notification
                    a(href='javascript:;')
                      i.fa.fa-users.text-aqua
                      |  5 new members joined today
                  // end notification
              li.footer(v-if='true')
                a(href='javascript:;') View all
          // Tasks Menu
          li.dropdown.tasks-menu
            a.dropdown-toggle(href='javascript:;', data-toggle='dropdown')
              i.fa.fa-flag-o
              span.label.label-danger {{  }} 
            ul.dropdown-menu
              li.header You have {{  }} task(s)
              li(v-if='true')
                // Inner menu: contains the tasks
                ul.menu
                  li
                    // Task item
                    a(href='javascript:;')
                      // Task title and progress text
                      h3
                        | Design some buttons
                        small.pull-right 20%
                      // The progress bar
                      .progress.xs
                        // Change the css width attribute to simulate progress
                        .progress-bar.progress-bar-aqua(style='width: 20%', role='progressbar', aria-valuenow='20', aria-valuemin='0', aria-valuemax='100')
                          span.sr-only 20% Complete
                  // end task item
              li.footer(v-if='true')
                a(href='javascript:;') View all tasks
          // User Account Menu
          li.dropdown.user.user-menu
            a.dropdown-toggle(href='javascript:;', data-toggle='dropdown')
              // The user image in the navbar
              img.user-image(v-bind:src='demo.avatar', alt='User Image')
              // hidden-xs hides the username on small devices so only the image appears.
              span.hidden-xs {{ demo.displayName }}
  // Left side column. contains the logo and sidebar
  sidebar(:display-name='demo.displayName', :picture-url='demo.avatar')
  // Content Wrapper. Contains page content
  .content-wrapper(style="clear:both")
    //- toast(position='se')
    // Content Header (Page header)
    section.content-header
    router-view
  // /.content-wrapper
  // Main Footer
  footer.main-footer
    .pull-right.hidden-xs
      b Version:  
      span {{v.major}}.{{v.minor}}.{{v.code}}
      b    Build date:  
      span {{version.date}}
    strong
      | Copyright © {{year}} &nbsp;
      a(href='javascript:;') bluecolor
      | .
    |  All rights reserved.
// ./wrapper


</template>

<script>

import _ from 'lodash'
import faker from 'faker'
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
    connection () {
      return _.find(this.connections, {id: this.connectionId})
    },
    connectionName () {
      if (this.connection) {
        return this.connection.name
      }
    },
    demo () {
      return {
        displayName: faker.name.findName(),
        avatar: faker.image.avatar(),
        email: faker.internet.email(),
        randomCard: faker.helpers.createCard()
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
    }
  },
  methods: {
    changeloading () {
      this.$store.commit('TOGGLE_SEARCHING')
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
