<template>
  <el-menu :default-active="activeMenu" style="height: 100%; width: 100%" :collapse="false" class="secondMenu" :unique-opened="false" :collapse-transition="false" mode="vertical">
    <template v-for="page in allPages" :key="page.id">
      <sidebar-item :item="page" @linkClick="linkClick" />
    </template>
  </el-menu>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'
import sidebarItem from './SidebarItem.vue'

@Options({ components: { sidebarItem } })
export default class index extends Vue {
  @Prop()
  private activeMenu: string

  @Prop()
  private allPages: any[]

  mounted() {}

  @Emit('linkClick')
  private linkClick(pageId) {}
}
</script>

<style lang="less" scoped>
.el-menu {
  border-right: none;
}
</style>
