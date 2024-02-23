 
<template>
  <div style="width:100%">
    <el-input v-if="resourceObj.objType=='fixedVal'" size="small" style="width:120px" v-model="resourceObj.val"
      @click="() =>{this.$emit('onFocus',this.resourceObj)}">
      <template #suffix>
        <el-icon @click="chooseResource">
          <Tools />
        </el-icon>
      </template>
    </el-input>
    <!-- ********************************************** -->
    <el-input v-if="resourceObj.objType=='variable'" size="small" style="width:120px" v-model="resourceObj.name"
      @click="() =>{this.$emit('onFocus',this.resourceObj)}">
      <template #suffix>
        <el-icon @click="chooseResource">
          <Tools />
        </el-icon>
      </template>
    </el-input>
    <!-- ********************************************** -->
    <el-button v-if="resourceObj.objType=='callback'" size="small" type="primary" class="themeButton"
      @click="()=>{this.settingCallBack(this.resourceObj)}">
      行为设置
    </el-button>
    <!-- ********************************************** -->
    <div v-if="resourceObj.objType=='method'" size="small" style="margin-top:4px">
      <el-button class="textEllipsis" style="width:160px;" @click="()=> this.$emit('onFocus',this.resourceObj)">
        <span>{{resourceObj.name}}</span>
      </el-button>
      <el-button style="width:30px;margin-top:-20px" @click="chooseResource">
        <el-icon>
          <Tools />
        </el-icon>
      </el-button>
    </div>
    <!-- ********************************************** -->
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
    // this.$emit('onSelectNodeChanged', obj, this.resourceObj)
  }

  private onCompleteSetting(callbacks) {
    ;(this.resourceObj as any).pCallbacks = callbacks
  }

  private chooseResource() {
    // window.console.log('显示弹窗')
    ;(this.$refs.resourceChooseWindow as any).show()
  }
}
</script>
 
<style scoped>
</style>