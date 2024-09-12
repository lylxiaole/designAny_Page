 
<template>
  <div v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
    <div v-if="onlyOneChild.meta" @click.stop="linkClick(item.path)">
      <el-menu-item :index="item.path" :title="$t(onlyOneChild.meta.title)" style="padding-left:40px;"
        :class="{ 'submenu-title-noDropdown': !isNest, 'is-active': item.path === $route.path }">
        <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="$t(onlyOneChild.meta.title)" />
      </el-menu-item>
    </div>
  </div>

  <el-submenu v-else ref="subMenu" :index="item.path" popper-append-to-body>
    <template #title>
      <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="$t(item.meta.title)" />
    </template>
    <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)"
      class="nest-menu" />
  </el-submenu>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'

@Options({})
export default class sidebarItem extends Vue {
  private onlyOneChild: any = null

  @Prop()
  private item: any
  @Prop()
  private isNest: Boolean
  @Prop()
  private basePath: String

  mounted() {}

  private hasOneShowingChild(children = [], parent) {
    const showingChildren = children.filter((item) => {
      if (item.hidden) {
        return false
      } else {
        // Temp set(will be used if only has one showing child)
        // window.console.log('onlyOneChild:', item)
        this.onlyOneChild = item
        return true
      }
    })

    // When there is only one child router, the child router is displayed by default
    if (showingChildren.length === 1) {
      return false
    }

    // Show parent if there are no child router to display
    if (showingChildren.length === 0) {
      this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
      return true
    }

    return false
  }
  private linkClick(routePath) {}
  private resolvePath(routePath) {
    return routePath
  }
}
</script>



<style scoped>
</style>