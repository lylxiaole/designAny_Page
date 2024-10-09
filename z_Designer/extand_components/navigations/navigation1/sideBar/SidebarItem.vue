<template>
  <div v-if="hasOneShowingChild(item)">
    <div @click.stop="linkClick(item.id)">
      <el-menu-item :index="item.id" :title="item.label" style="padding-left: 40px">
        <item :icon="item.icon" :title="item.label" />
      </el-menu-item>
    </div>
  </div>

  <el-sub-menu v-else :index="item.id" popper-append-to-body popper-class="is-opened">
    <template #title>
      <item :icon="item.icon" :title="item.label" />
    </template>
    <sidebar-item v-for="child in item.children" :key="child.id" @linkClick="linkClick" :is-nest="true" :item="child" class="nest-menu" />
  </el-sub-menu>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import Item from './Item.vue'
@Options({
  components: {
    Item
  }
})
export default class SidebarItem extends Vue {
  private onlyOneChild: any = null

  @Prop()
  private item: any
  @Prop()
  private isNest: Boolean

  mounted() {}

  private hasOneShowingChild(item) {
    if (item.children && item.children.length > 0) {
      return false
    } else {
      return true
    }
  }

  @Emit('linkClick')
  private linkClick(pageId) {}
}
</script>

<style scoped></style>
