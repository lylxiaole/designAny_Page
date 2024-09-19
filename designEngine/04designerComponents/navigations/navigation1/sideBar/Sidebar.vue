 
<template>
  <div style="height:100%;width:100%">
    <el-menu :default-active="activeMenu" :collapse="false" class="secondMenu" background-color="transparent" :unique-opened="false"
      active-text-color="#FFFFFF" :collapse-transition="false" mode="vertical">
      <template v-for="page in allPages" :key="page.id">
        <sidebar-item :item="page" @linkClick="linkClick" />
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'
import sidebarItem from './SidebarItem.vue'

@Options({ components: { sidebarItem } })
export default class index extends Vue {
  private activeMenu: string = null

  @Prop()
  private allPages: any[]

  mounted() {}

  @Emit('linkClick')
  private linkClick(pageId) {}
}
</script>



<style scoped>
</style>