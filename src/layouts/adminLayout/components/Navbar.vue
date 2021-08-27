<template>
  <div class="navbar flexHorilanLayout">
    <hamburger id="hamburger-container" style="width:45px" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <tags-view style="width:calc(100% - 250px);" id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu" style="width:205px">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item hover-effect" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <i style="font-size:26px" class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/selfInfo/index">
            <el-dropdown-item>个人信息</el-dropdown-item>
          </router-link>
          <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { mapGetters } from 'vuex'
import Breadcrumb from '@src/components/Breadcrumb/index.vue'
import Hamburger from '@src/components/Hamburger/index.vue'
import ErrorLog from '@src/components/ErrorLog/index.vue'
import Screenfull from '@src/components/Screenfull/index.vue'
import SizeSelect from '@src/components/SizeSelect/index.vue'
import Search from '@src/components/HeaderSearch/index.vue'
import TagsView from './TagsView/index.vue'

@Component({
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
    TagsView
  }
})
export default class Navbar extends Vue {
  private get sidebar() {
    return this.$store.getters.sidebar
  }
  private get avatar() {
    // window.console.log('navbar avatar:', this.$store.getters.avatar)
    return this.$store.getters.avatar
  }
  private get device() {
    return this.$store.getters.device
  }

  private toggleSideBar() {
    this.$store.dispatch('app/toggleSideBar')
  }
  private async logout() {
    window.console.log('logout')
    try {
      await this.$store.dispatch('user/logout')
    } catch (error) {
    } finally {
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
