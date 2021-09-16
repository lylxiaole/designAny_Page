<template>
  <div>
    <a-row>
      <a-col :span="2" v-if="isShowTitle==undefined">
        <div style="width:10px;height:24px;background:rgba(245,166,35,1);margin-left:30px"></div>
      </a-col>
      <a-col :span="9" v-if="isShowTitle==undefined">
        <div style="font-size:18px;font-weight:600;color:rgba(0,0,0,0.85);line-height:18px;margin-top:3px">模型实例</div>
      </a-col>
      <a-col :span="12">
        <a-button style="width:130px;height:30px;background:rgba(245,166,35,1);color:rgba(255,255,255,1);" @click="startEdit">
          <a-icon style="font-size:17px" :component="modelIco" />添加模型实例
        </a-button>
      </a-col>
    </a-row>
    <div class="flexHorilanLayout">

      <a-modal :maskClosable="false" title="添加模型实例" :destroyOnClose="true" v-model="windowVisible" width="50%" height="29.72%" @ok="onOk"
        @cancel="onCancel" cancelText="取消" okText="确定" :okButtonProps="{ props: {icon: 'check'}}" :cancelButtonProps="{ props: {icon: 'close'}}">
        <div v-if="windowVisible" style="width:100%;height:100%">
          <a-row class="np-design-model-row">
            <a-col :offset="2" :span="4">
              <span>实例别名</span>
            </a-col>
            <a-col :span="14">
              <a-input style="width:100%" v-model="newModelBinding.modelBindingName" ref="modelnameInput" @change="onModelNameChanged" />
            </a-col>
          </a-row>

          <a-row class="np-design-model-row">
            <a-col :offset="2" :span="4">
              <span>模型来源</span>
            </a-col>
            <a-col :span="14">
              <a-radio-group style="width:100%" v-model="newModelBinding.modelBindingType" @change="onParamTypeChanged">
                <a-radio :value="2">简单类型</a-radio>
                <a-radio :value="1">系统模型</a-radio>
              </a-radio-group>
            </a-col>
          </a-row>

          <a-row class="np-design-model-row">
            <a-col :offset="2" :span="4">
              <span>选择模型</span>
            </a-col>
            <a-col :span="14">
              <a-select v-if="newModelBinding.modelBindingType==2" showSearch v-model="currentSelectModelId" style="width: 100%"
                :defaultActiveFirstOption="false" :multiple="false" :showArrow="false" :filterOption="false" :notFoundContent="null"
                @select="onSelectSimpleModel" :dropdownStyle="{width:'250px', maxHeight: '400px', overflow: 'auto' }">
                <a-select-option v-for="d in allSimpleClasses" :key="d.modelCode">{{d.name}}</a-select-option>
              </a-select>

              <a-input-search v-if="newModelBinding.modelBindingType==1" @search="$refs.masterModal.add()" size="default"
                v-model="newModelBinding.modelBindingInfo.name" style="width: 100%" readonly>
                <a-button slot="enterButton">选择模型</a-button>
              </a-input-search>
              <template v-if="newModelBinding.modelBindingType==1">
                <!-- <master-aggregatemodel title="选择模型" ref="masterModal" @handleMasterModalOk="handleMasterOk" /> -->
                <!-- <modelChooseWindow @onChooseModel="onChooseModel" :isVisible.sync="isShowAddModel" /> -->
              </template>
            </a-col>
          </a-row>

          <a-row class="np-design-model-row" v-if="newModelBinding.modelBindingType==1">
            <a-col :offset="2" :span="4">
              <span>单模/集合</span>
            </a-col>
            <a-col :span="14">
              <a-radio-group v-model="newModelBinding.modelDataType" @change="paramIsListChanged">
                <a-radio :value="'single'">单模</a-radio>
                <a-radio :value="'list'">集合</a-radio>
                <!-- <a-radio :value="'tree'">树</a-radio> -->
              </a-radio-group>
            </a-col>
          </a-row>

          <a-row style="margin: 8px 0px;" v-if="newModelBinding.modelBindingType==1&&newModelBinding.modelDetailInfo">
            <a-col :offset="2" :span="4">
              <span>可用列</span>
            </a-col>
            <a-col :span="18">
              <a-checkbox-group style="height:300px;overflow-y:auto;" :defaultValue="currentSelectFuncCols" @change="onSelectedModelFuncColumn"
                class="editarea">
                <a-checkbox style="margin-top:5px;margin-left:5px;width:100%" v-for="funcCol in newModelBinding.modelFuncColumns"
                  :value="funcCol.code" :key="funcCol.code">
                  <span>
                    {{getPropName(funcCol.code)}}
                    <!-- {{getModelName(prop.modelId)+'_'+prop.propertyName}}  -->
                  </span>

                  <span v-if="funcCol.isChoose" style="margin-left:30px">列公式:</span>
                  <a-select v-if="funcCol.isChoose" size="small" style="margin-left:10px;width:30%" @change="(e)=>{onSelectColumnFunc(funcCol,e)}">
                    <a-select-option v-for="colfunc in allColumnFuncs" :key="colfunc.name" :value="colfunc.val">{{colfunc.name}}</a-select-option>
                  </a-select>
                </a-checkbox>
              </a-checkbox-group>
            </a-col>
          </a-row>
        </div>
      </a-modal>

      <master-aggregatemodel title="选择模型" ref="masterModal" @handleMasterModalOk="handleMasterOk" :modalType='2' />
    </div>
  </div>
</template>



<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import ComponentBase from '../../04designerComponents/ComponentBase'
import PageBase from '../../05designerLayouts/PageBase'
import MasterAggregatemodel from '@/views/model/modules/aggregatemodel/MasterAggregatemodel.vue'

import { CurrentApis, AuthorityCode } from '../../01designerContext'
import modelBingding, {
  modelDataTypeEnum,
  bindingModelVal_InProperty,
  modelCodeInfo,
  modelFilter,
  modelOrder,
  modelFilterTypeEnum,
  modelOrderTypeEnum,
  modelFuncColumn,
  funcColumnEnum,
  bindTypeEnum,
  getAllFilters,
} from '../../02common/commonClasses/modelBingding'
import modelAnalysis, { modelSimpleInfo, modelDetailInfo, ModelProperty, modelTypeEnum } from '../../02common/impResourcesCache/modelAnalysis'
import modelChooseWindow from './modelChooseWindow.vue'
import { buttonAddIco } from '../../assets/icons.js'

class treenode {
  title: string
  key: string
  value: string
  isLeaf: boolean
}

@Component({
  components: {
    modelChooseWindow,
    MasterAggregatemodel,
  },
})
export default class addModelWindow extends Vue {
  @Prop() currentPage: PageBase
  @Prop() isShowTitle: boolean

  private currentSelectModelId: string = null
  private modelIco: any = buttonAddIco
  private isShowAddModel: boolean = false
  windowVisible: boolean = false
  newModelBinding: modelBingding

  /**简单类型 */
  get allSimpleClasses(): modelSimpleInfo[] {
    return [
      { name: '字符串', modelCode: 'String', modelId: 'String' },
      { name: '布尔', modelCode: 'Bool', modelId: 'Bool' },
      { name: '数字', modelCode: 'Number', modelId: 'Number' },
    ]
  }

  get allColumnFuncs(): any[] {
    let res: any[] = []
    res.push({ val: '', name: '无' })
    res.push({ val: funcColumnEnum.COUNT, name: '求总个数' })
    res.push({ val: funcColumnEnum.SUM, name: '求和' })
    res.push({ val: funcColumnEnum.AVG, name: '求平均值' })
    res.push({ val: funcColumnEnum.MAX, name: '求最大值' })
    res.push({ val: funcColumnEnum.MIN, name: '求最小值' })
    return res
  }

  private currentSelectFuncCols: string[] = []
  private refreshCurrentSelectFuncCols() {
    this.currentSelectFuncCols = []
    if (this.newModelBinding.modelBindingType == 2 || !this.newModelBinding.modelFuncColumns) {
      return
    }
    this.newModelBinding.modelFuncColumns.forEach((o) => {
      if (o.isChoose == true) {
        this.currentSelectFuncCols.push(o.code)
      }
    })
  }

  private getPropName(propertyCode: string) {
    if (!this.newModelBinding || !this.newModelBinding.modelAllProperties) {
      return ''
    }

    var find = this.newModelBinding.modelAllProperties.find((o) => o.propertyCode == propertyCode)
    if (!find) {
      return '已删除'
    }

    return modelAnalysis.getModelPropertyShowName(find)
  }

  /**当前选择的模型类型变化时 */
  private async onParamTypeChanged(val: any) {
    if (val.target) {
      this.newModelBinding.modelBindingType = val.target.value
    } else {
      this.newModelBinding.modelBindingType = val
    }

    var currentModelInfo = null
    if (this.newModelBinding.modelBindingType == 2) {
      this.newModelBinding.modelBindingInfo = common.clone(this.allSimpleClasses[0])
      this.currentSelectModelId = this.allSimpleClasses[0].modelId
    } else {
      this.newModelBinding.modelBindingInfo = new modelSimpleInfo()
      this.currentSelectModelId = null
    }
    this.$forceUpdate()
  }
  private async onModelNameChanged(val: any) {
    this.newModelBinding.modelBindingName = val.target.value
    this.$forceUpdate()
  }
  private async paramIsListChanged(val: any) {
    //window.console.log('切换数据类型')
    this.newModelBinding.modelDataType = val.target.value
    this.$forceUpdate()
  }
  private async startEdit() {
    this.newModelBinding = new modelBingding()
    this.newModelBinding.modelDataType = modelDataTypeEnum.single
    this.newModelBinding.modelBindingType = 2
    this.newModelBinding.modelBindingName = ''
    this.onParamTypeChanged(2)
    this.windowVisible = true
  }

  private async onSelectedModelFuncColumn(propertyCodes: string[]) {
    //window.console.log('*********选择了函数列', propertyCodes)
    this.newModelBinding.modelFuncColumns.forEach((o) => {
      if (propertyCodes.indexOf(o.code) > -1) {
        o.isChoose = true
      } else {
        o.isChoose = false
      }
      o.func = null
    })

    this.$forceUpdate()
  }

  private onSelectColumnFunc(funcColumn: modelFuncColumn, e?: funcColumnEnum) {
    //window.console.log('*********修改了列公式', e, funcColumn)
    var funcColumn = this.newModelBinding.modelFuncColumns.find((o) => o.code == funcColumn.code)
    if (!funcColumn) {
      return
    }
    if (!e) {
      funcColumn.func = null
    } else {
      funcColumn.func = e
    }
  }

  /**当选择简单类型时 */
  private async onSelectSimpleModel(selectModelId: string) {
    let find = this.allSimpleClasses.find((o) => o.modelId == selectModelId)
    this.newModelBinding.modelBindingInfo = common.clone(find)

    this.$forceUpdate()
  }

  private async onAddSystemModel() {
    //window.console.log('添加模型弹窗')
    ;(this.$refs.masterModal as any).add()
    // this.isShowAddModel = true
  }
  /**当选择模型时 */
  private async onChooseModel(model: any) {
    //window.console.log('选择了一个模型')
    var newmodelSimpleInfo = { name: model.modelName, modelId: model.id, modelCode: model.modelCode }
    this.newModelBinding.modelBindingInfo = newmodelSimpleInfo
    this.newModelBinding.modelDetailInfo = model
    this.newModelBinding.modelFuncColumns = []

    this.newModelBinding.modelAllProperties.forEach((o) => {
      this.newModelBinding.modelFuncColumns.push({ code: o.propertyCode, isChoose: true })
    })
    this.refreshCurrentSelectFuncCols()
    this.$forceUpdate()
  }

  private async handleMasterOk(masterData: any[]) {
    //window.console.log('选择了一个模型：', masterData)
    this.onChooseModel(masterData[0])
    // let model = JSON.parse(JSON.stringify(masterData))
    // if (model[0].modelType === 'BASIC') {
    //   getDistributedUID(1).then((res) => {
    //     masterData[0].modelId = model[0].id
    //     masterData[0].id = res
    //     this.$refs.MasterConfigAggregateModel.data = masterData
    //     this.handelPushModelInfos(masterData)
    //   })
    // } else if (model[0].modelType === 'VIEW') {
    //   let aggregatemodels = model[0].modelRelationList
    //   let aggregatemodelmodelPropertyList = []
    //   var arry = [...aggregatemodels]
    //   Promise.all(
    //     arry.map((element) => {
    //       return new Promise((resolve, reject) => {
    //         getModel(element.modelId).then((res) => {
    //           res.data.modelAlias = element.modelAlias
    //           resolve(res.data)
    //         })
    //       })
    //     })
    //   ).then((data) => {
    //     data.forEach((prop) => {
    //       prop.modelPropertyList.forEach((p) => {
    //         prop.modelId = prop.id
    //         p.propertyCode = prop.modelAlias + '__' + p.propertyCode
    //         aggregatemodelmodelPropertyList.push(p)
    //       })
    //     })
    //     this.$refs.MasterConfigAggregateModel.data = data
    //     this.handelPushModelInfos(masterData)
    //   })
    // }
  }

  private onOk() {
    if (!this.newModelBinding.modelBindingName || this.newModelBinding.modelBindingName == '') {
      this.$message.error('名称不能为空')
      return
    }

    var findSameName = this.currentPage.modelBindings.filter((o) => o.modelBindingName == this.newModelBinding.modelBindingName)[0]
    if (findSameName) {
      this.$message.error('已经有相同名称的模型实例存在,请换一个实例名称')
      return
    }
    this.windowVisible = false
    this.onSure(this.newModelBinding)
  }
  private onCancel() {
    this.windowVisible = false
  }

  @Emit('onSure')
  public onSure(modelBinding: modelBingding) {}
}
</script>



<style scoped>
.np-design-model-row {
  margin: 8px 0px;
  height: 32px;
  line-height: 32px;
}
</style>