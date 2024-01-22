 <template>
  <a-modal :maskClosable="false" title="选择资源" :bodyStyle="{padding:'0px 8px 8px 8px',background: '#FFF'}" width="95%" style="bottom:0;height:85%;"
    v-model="isVisible" @ok="onOk" @cancel="handleCancel" :cancelButtonProps="{ props: {icon: 'close'}}" :okButtonProps="{ props: {icon: 'check'}}"
    cancelText="取消" okText="确定">
    <a-layout style="height:54px;padding:0px 0px 8px 0px;background:#FFF;">
      <div style="width:100%;height:100%;justify-content:left;padding:6px 0px;overflow:hidden;background-color:#F6F6F6" class="flexHorilanLayout">
        <div style="background:#18aeb7;width:6px;height:46px;"></div>
        <span style="margin-left:9px;float:left;fontSize:18px">资源库</span>
      </div>
    </a-layout>
    <resouceChooseComp ref="resourceTree" style="height:100%;overflow-x:auto;overflow-y:hidden;border:1px solid #ccc"
      @onSelectedObj="onSelectedObj" />
    <div ref="drawpage">
      <div></div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineComponent, EngineLayout } from '@designEngine/index'

import { deepClone, getUuid } from '@common/utils'
import {
  groupNode,
  objectBase,
  objectType,
  object_Variable,
  object_FixedVal,
  object_Method,
  object_callback,
  resourceType
} from '@designEngine/index'

import { getSearchClass, pageSearchBase } from '@designEngine/index'
import resouceChooseComp from './resouceChooseComp.vue'

@Options({
  components: {
    resouceChooseComp
  }
})
export default class resoucesChooseWindow extends Vue {
  @Prop() private isVisible: boolean
  @Emit('update:isVisible')
  private updateIsVisible_Inner(val: any) {}

  @Watch('isVisible')
  private onIsVisibleChange(val: boolean) {}

  private currentObj: objectBase = null

  private onOk() {
    this.onChooseObj(this.currentObj)
    this.updateIsVisible_Inner(false)
  }
  private handleCancel() {
    this.updateIsVisible_Inner(false)
  }

  private onSelectedObj(obj: objectBase) {
    this.currentObj = deepClone(obj)
    //window.console.log('---------------------------this.currentObj',this.currentObj)
    this.$nextTick(() => {
      var resouContainer = this.$refs.resourceTree as any
      resouContainer.$el.scrollLeft = resouContainer.$el.scrollWidth
    })
    // //如果是页面弹窗，先加载页面数据，再创建参数
    // if (this.currentObj && (this.currentObj.resourceType == resourceType.pagePopupWindow || this.currentObj.resourceType == resourceType.pageRoute)) {
    //   var methodObj = this.currentObj as object_Method
    //   var mpage = new PageBase()
    //   mpage.Load(this.currentObj.resourceId)
    //   mpage.inParams.filter((inp) => {
    //     var node = pageSearchBase.actionFctory.makeObject(inp.key, '手填固定值', objectType.fixedVal, resourceType.fixedVal)
    //     methodObj.inputParams.push({ key: inp.key, name: '入参-' + inp.paramName, obj: node, isModel: inp.paramType == 1 })
    //   })
    //   mpage.$destroy()
    // }
  }

  @Emit('onChooseObj')
  private onChooseObj(obj: objectBase) {}
}
</script>

<style lang="less" scoped>
</style>
