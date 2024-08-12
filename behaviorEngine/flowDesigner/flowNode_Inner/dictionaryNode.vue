<template>
  <el-row style="border:1px solid #cdcdcd;width：100%;height:100%;box-sizing:border-box;background:#fff" class="verticalAlignCenter flexHorilanLayout">
    <div style="width:40px;height:100%">
      <template v-if="actObj.inputParams&&actObj.inputParams.length>0">
        <div v-for="inParam in actObj.inputParams" :key="inParam.key" :style="{'height':inParamHeight}" class="verticalAlignCenter">
          {{inParam.name}}
        </div>
      </template>
      <template v-else>
        <el-row>
          无输入
        </el-row>
      </template>
    </div>
    <!-- **************************************************** -->
    <div style="width:calc(100% - 80px)">
      <el-row>
        <el-select style="width:100%" v-model="selectedKey">
          <el-option v-for="dic in allDictionarys" :key="dic.id" :label="dic.value" :value="dic.key" />
        </el-select>
      </el-row>
    </div>
    <!-- **************************************************** -->
    <div style="width:40px">
      <template v-if="actObj.outParam">
        <el-row>
          输出
        </el-row>
      </template>
      <template v-else>
        <el-row>
          无输出
        </el-row>
      </template>
    </div>
  </el-row>
</template>

<script lang="ts">
import { inject, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@behaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'

@flowDesignNode(funcCode.dictionary, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class dictionaryNode extends Vue {
  // private getNode: Function = inject('getNode')
  public get inParamHeight() {
    if (!this.actObj.inputParams || this.actObj.inputParams.length < 1) {
      return '0px'
    } else {
      return 100 / this.actObj.inputParams.length + '%'
    }
  }
  @Prop()
  private nodeModel: any

  private get actObj(): actionObj {
    let { actObj } = this.nodeModel.getProperties()
    return actObj
  }

  mounted() {
    this.loadData()
  }

  private selectedKey: string = null
  @Watch('selectedKey')
  private onselectedKeyChanged(val) {
    if (!val) {
      this.actObj.outParam = null
      this.actObj.resourceFilter = {}
    } else {
      this.actObj.outParam = {
        key: getUuid(),
        name: ''
      }
      this.actObj.resourceFilter = {
        dicKey: val
      }
    }
    this.nodeModel.setProperties({ actObj: this.actObj })
    this.nodeModel.updateAnchor()
    this.$forceUpdate()
  }

  private allDictionarys = []
  private async loadData() {
    let allDics = await behaviorContext.getAllDictionary()
    this.allDictionarys = allDics
    this.selectedKey = this.actObj.resourceFilter.dicKey
  }
}
</script>


<style lang="less" scoped>
</style>