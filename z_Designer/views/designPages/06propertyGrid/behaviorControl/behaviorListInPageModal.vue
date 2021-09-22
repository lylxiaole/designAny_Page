 <template>
  <a-modal :maskClosable="false" title="行为选择" v-model="isVisible" width="95%" @ok="onOk" @cancel="handleCancel"
    :cancelButtonProps="{ props: {icon: 'close'}}" :okButtonProps="{ props: {icon: 'check'}}" cancelText="取消" okText="确定" :zIndex="2000">
    <div>
      <div v-if="showDetailSetting==false">
        <vxe-table :data="allBehaviors" :stripe="true" :resizable="true"
          :radio-config="{checkRowKey: callboackbehaviorid,trigger: 'dblclick', mode: 'row'}" :keyboard-config="{isArrow: true}" :show-header="true"
          width="100%" height="470" :border="true" @radio-change="radioChangeEvent" row-id="id" highlight-current-row highlight-hover-row>
          <vxe-table-column type="radio" width="50"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="name" title="行为名称"></vxe-table-column>
          <vxe-table-column field="description" title="描述"></vxe-table-column>
        </vxe-table>
      </div>
      <geno-behaviorDeatilSetting style="width:100%;height:600px" v-if="showDetailSetting==true" :currentPage="currentPage"
        :currentLayout="currentLayout" :currentSettingBehavior.sync="currentSettingBehavior" />
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import { layoutEvent, layoutMethod, param, paramType } from '../../03designerLayoutBase'
import { layoutEventBehaviors, behavior, action, actionDetail } from '../../02common/behavior/behaviorTypes'

import PageBase from '../../03designerLayoutBase/PageBase'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import { pageSearchBase } from '../../02common/behavior/04_actionReaourceTree'

@Component({
  components: {}
})
export default class behaviorListInPageModal extends Vue {
  @Prop() private isVisible: boolean
  @Emit('update:isVisible')
  private updateIsVisible_Inner(val: any) {}

  @Watch('isVisible')
  private onIsVisibleChange(val: boolean) {}

  //当前页面
  @Prop() currentPage: PageBase
  //当前正在设计的布局
  @Prop() currentLayout: LayoutBase
  @Prop() private callboackbehaviorid: string
  @Emit('update:currentSelectedBehaviors')
  private updateCurrentSelectedBehaviors_Inner(val: any) {}

  private currentSelectedBehaviors: behavior[]

  // 当前页面中的所有行为列表
  private allBehaviors: behavior[] = []

  /**是否显示行为详细设置 */
  public showDetailSetting: boolean = false
  /**当前正在设置的行为 */
  private currentSettingBehavior: behavior = null

  mounted() {
    // window.console.log(1212121212121)
    if (pageSearchBase.currentPage) {
      this.allBehaviors = common.clone(pageSearchBase.currentPage.behaviors)
      this.currentSelectedBehaviors = this.allBehaviors.filter((b) => b.id === this.callboackbehaviorid)
    }
  }

  // ***********************行为列表处理*************************************************************
  /**开始编辑一个行为 */
  editBehavior(behaviorId: string) {
    window.console.log('编辑行为明细')
    this.showDetailSetting = true
    var find = this.allBehaviors.find((o) => o.id == behaviorId)
    this.currentSettingBehavior = common.clone(find)
  }
  /**为了让动作列表，具有完整的get set 和方法，需要崇训组织action列表 */
  deleteBehavior(behaviorId: string) {
    var findIndex = this.allBehaviors.findIndex((o) => o.id == behaviorId)
    this.allBehaviors.splice(findIndex, 1)
  }
  bahaviorListAdd() {
    var newbehavior = new behavior()
    newbehavior.id = common.getUuid()
    newbehavior.name = '新建行为'
    newbehavior.description = ''
    this.allBehaviors.push(newbehavior)
  }
  radioChangeEvent({ row }: any) {
    // window.console.log('选择行为', this.currentSelectedBehaviors)
    // window.console.log(this.callboackbehaviorid)
    this.currentSelectedBehaviors = []
    var behavior = row as behavior
    this.currentSelectedBehaviors.push(behavior)
    this.updateCurrentSelectedBehaviors_Inner(this.currentSelectedBehaviors)
  }
  private onOk() {
    //确定
    this.onChooseBehavior(this.currentSelectedBehaviors[0])
    // pageSearchBase.currentBehavior.callbackbehavior = this.currentSelectedBehaviors[0]
    this.updateIsVisible_Inner(false)
  }
  private handleCancel() {
    this.updateIsVisible_Inner(false)
  }
  // ***********************对外事件*************************************************************
  public saveCurrentBehavior(): boolean {
    var data: behavior = null
    if (!this.currentSettingBehavior) {
      return false
    } else {
      data = common.clone(this.currentSettingBehavior) as behavior
    }
    var findIndex = this.allBehaviors.findIndex((o) => o.id == data.id)
    this.allBehaviors[findIndex] = data
    this.saveBehaviorList()
  }
  public saveBehaviorList(): boolean {
    pageSearchBase.currentPage.behaviors = this.allBehaviors
    return true
  }

  @Emit('onChooseBehavior')
  onChooseBehavior(beha: behavior) {}
}
</script>

