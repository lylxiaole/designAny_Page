 
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

    <resourceChooseWindow ref="resourceChooseWindow" @onChooseObj="onChooseObj"></resourceChooseWindow>

    <callbackSetting ref="callbackSetting" @onCompleteSetting="onCompleteSetting" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop, InjectReactive, ProvideReactive } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'

import bahaviorResourceTree from '../behaviorResources/behaviorResourcesSelect.vue'
import {
  object_Signs,
  objectType,
  resourceType,
  resourceGroup,
  getFuncObjByObjType,
  object_Method,
  object_callback,
  object_FixedVal,
  object_Variable
} from '@behaviorEngine/index'
import resourceChooseWindow from './resoucesChooseWindow.vue'
import callbackSetting from './callbackSetting/callbackSetting.vue'

@Options({
  components: { resourceChooseWindow, callbackSetting }
})
export default class signChooser extends Vue {
  @Prop()
  private resourceObj: object_callback | object_Method | object_FixedVal | object_Variable

  mounted() {}

  private onChooseObj(obj) {
    this.$emit('update:resourceObj', obj)
    // this.$emit('onSelectNodeChanged', obj, this.currentObj)
  }

  private onCompleteSetting(callbacks) {
    ;(this.resourceObj as any).pCallbacks = callbacks
  }
}
</script>
 
<style scoped>
</style>