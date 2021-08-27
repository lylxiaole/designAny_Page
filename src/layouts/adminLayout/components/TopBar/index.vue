<template>
  <div style="width:100%;height:100%;position:relative;background-color:#3D3D3D">
    <div style="float:left;width:200px;height:30pt;line-height:30pt" class="item">
      <img style="height: 20pt;margin-top:5pt" src="@src/assets/controllerImgs/logo.png" />
    </div>
    <template v-for="route in permission_routes">
      <div style="float:left" :key="route.path" @click="linkClick(route.path)" :style="{'float':'left','background-color':cuteBackgroundColor(route)}"
        class="item canChooseItem">
        <app-link v-if="route.meta" :to="resolvePath(route.path)">
          {{route.meta.title}}
        </app-link>
      </div>
    </template>
    <div style="float:right" class="item" @click="logout">退出</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { isExternal } from '@src/utils/validate'
import AppLink from '../Sidebar/Link.vue'

// **********************************
@Component({
  components: { AppLink }
})
export default class index extends Vue {
  private currentRoutePath: string = ''

  private get permission_routes(): any[] {
    return this.cuteRoutes(this.$store.state.system.permission_routes)
  }

  private cuteBackgroundColor(targetRoute) {
    let currentRoutePath = this.currentRoutePath
    if (!currentRoutePath) {
      currentRoutePath = this.$router.currentRoute.path
    }
    // window.console.log('target route:', targetRoute.path)
    // window.console.log('current route:', currentRoutePath)

    if (targetRoute.path === currentRoutePath) {
      return '#83C346'
    } else {
      return ''
    }
  }

  private get currentRoute(): any {
    return this.$router.currentRoute
  }

  private cuteRoutes(routes) {
    let res = []
    const showingChildren = routes.filter((item) => {
      if (item.hidden) {
        return false
      } else {
        return true
      }
    })

    for (let index = 0; index < showingChildren.length; index++) {
      const element = showingChildren[index]
      if (element.meta && !element.children) {
        res.push(element)
      }
      if (element.children) {
        res = res.concat(this.cuteRoutes(element.children))
      }
    }

    return res
  }
  private resolvePath(routePath) {
    if (isExternal(routePath)) {
      return routePath
    }
    return routePath + ''
  }
  private async logout() {
    try {
      await this.$store.dispatch('user/logout')
    } catch (error) {
    } finally {
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }

  private async linkClick(routePath) {
    this.currentRoutePath = routePath
  }

  mounted() {
    // window.console.log('currentRoute', this.$router.currentRoute)
  }
  destroyed() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item {
  width: 60pt;
  height: 30pt;
  line-height: 30pt;
  float: left;
  color: white;
  cursor: pointer;
  text-align: center;
}

.canChooseItem:hover {
  background-color: #83c346;
}
</style>
