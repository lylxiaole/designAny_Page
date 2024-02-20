 
<template>
  <div style="width:100%">
    <el-dropdown ref="dropdown1" trigger="contextmenu" @command="menuSelected">
      <el-button @click="showClick">{{signObj?signObj.name:''}}</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="sign in allSigns" :key="sign.resourceType" :command="sign.resourceType"
            :value="sign.resourceType">{{sign.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop, InjectReactive, ProvideReactive } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'

import bahaviorResourceTree from '../behaviorResources/behaviorResourcesSelect.vue'
import { object_Signs, objectType, resourceType, resourceGroup, getFuncObjByObjType } from '@behaviorEngine/index'

@Options({
  components: {}
})
export default class signChooser extends Vue {
  @Prop()
  private signObj: object_Signs

  private allSigns: any[] = []
  mounted() {
    this.allSigns = getFuncObjByObjType(objectType.signs)
  }

  private showClick() {
    ;(this.$refs.dropdown1 as any).handleOpen()
  }

  private menuSelected(key) {
    var currentnode = this.allSigns.find((o) => o.resourceType == key)
    this.$emit('update:signObj', currentnode)
  }
}
</script>
 
<style scoped>
</style>