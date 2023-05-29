<template>
  <div style="width:100%;height:100%;position:relative;background-color:#3D3D3D">
    <div style="float:left;width:200px;height:30pt;line-height:30pt" class="item">
      <!-- <img style="height: 20pt;margin-top:5pt" src="@src/assets/controllerImgs/logo.png" /> -->
    </div>
    <template v-for="route in permission_routes">
      <div v-if="!route.hidden" style="float:left" :key="route.path" @click="linkClick(route.path)"
        :style="{'float':'left','background-color':cuteBackgroundColor(route)}" class="item canChooseItem">
        <span v-if="route.meta" style="color:white">
          {{route.meta.title}}
        </span>
      </div>
    </template>
    <div style="float:right" class="item" @click="logout">退出</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit,Watch,Prop } from 'vue-property-decorator'
import { isExternal } from '@common/utils/validate'
import AppLink from '../Sidebar/Link.vue'

// **********************************
@Options({
  components: { AppLink }
})
export default class index extends Vue {
  private get permission_routes(): any[] {
    return this.cuteRoutes(this.$store.state.system.permission_routes)
  }

  private cuteBackgroundColor(targetRoute) {
    let currentRoutePath = this.$route.path

    if (targetRoute.path === currentRoutePath) {
      return '#83C346'
    } else {
      return ''
    }
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
      if (element.hidden) {
        continue
      }
      if (element.meta && !element.children) {
        res.push(element)
      }
      if (element.children) {
        res = res.concat(this.cuteRoutes(element.children))
      }
    }

    return res
  }

  private async logout() {
    try {
      await this.$store.commit('system/CLEAR_TOKEN')
    } catch (error) {
    } finally {
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }

  private linkClick(routePath) {
    this.$router.push({ path: routePath })
  }

  mounted() {}
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
  color: white;
}
</style>
