<template>
  <a-modal :maskClosable="false" title="编辑模型实例" :destroyOnClose="true" v-model="windowVisible" width="46.93%" height="62.04%" @ok="onOk"
    @cancel="onCancel" cancelText="取消" okText="确定" :okButtonProps="{ props: {icon: 'check'}}" :cancelButtonProps="{ props: {icon: 'close'}}">
    <div v-if="windowVisible" style="width:100%;height:100%">
      <a-row class="np-design-model-row">
        <a-col :offset="2" :span="2">
          <span>实例别名</span>
        </a-col>
        <a-col :span="20">
          <a-input readonly v-model="currentModelBinding.modelBindingName" ref="modelnameInput" />
        </a-col>
      </a-row>

      <a-row class="np-design-model-row">
        <a-col :offset="2" :span="2">
          <span>模型来源</span>
        </a-col>
        <a-col :span="20">
          <a-radio-group :disabled="true" v-model="currentModelBinding.modelBindingType">
            <a-radio :value="2">简单类型</a-radio>
            <a-radio :value="1">系统模型</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>

      <a-row class="np-design-model-row">
        <a-col :offset="2" :span="2">
          <span>选择模型</span>
        </a-col>
        <a-col :span="20">
          <a-select :disabled="true" v-if="currentModelBinding.modelBindingType==2" showSearch v-model="currentSelectModelId"
            :defaultActiveFirstOption="false" :multiple="false" :showArrow="false" :filterOption="false" :notFoundContent="null"
            :dropdownStyle="{width:'400px', maxHeight: '400px', overflow: 'auto' }">
            <a-select-option v-for="d in allSimpleClasses" :key="d.modelCode">{{d.name}}</a-select-option>
          </a-select>

          <a-input-search readonly v-if="currentModelBinding.modelBindingType==1" size="default" style="width: 100%"
            v-model="currentModelBinding.modelDetailInfo.modelName" @search="$refs.editModal.edit(currentModelBinding.modelDetailInfo)">
            <a-button slot="enterButton">编辑模型</a-button>
          </a-input-search>
          <template v-if="currentModelBinding.modelBindingType==1">
            <add-basemodel ref="editModal" @addbasemodelok="onEditModalSucceed" />
          </template>
        </a-col>
      </a-row>

      <a-row sclass="np-design-model-row" v-if="currentModelBinding.modelBindingType==1">
        <a-col :offset="2" :span="2">
          <span>单模/集合</span>
        </a-col>
        <a-col :span="20">
          <a-radio-group v-model="currentModelBinding.modelDataType" @change="paramIsListChanged">
            <a-radio :value="'single'">单模</a-radio>
            <a-radio :value="'list'">集合</a-radio>
            <!-- <a-radio :value="'tree'">树</a-radio> -->
          </a-radio-group>
        </a-col>
      </a-row>
      <!-- ************************************************ -->
      <a-row style="margin: 8px 0px;" v-if="currentModelBinding.modelBindingType==1&&currentModelBinding.modelDetailInfo">
        <a-col :offset="2" :span="2">
          <span>可用列</span>
        </a-col>
        <a-col :span="20">
          <div :style="{ borderBottom: '1px solid #E9E9E9' }">
            <a-checkbox :checked="checkAll" @change="onCheckAllChange">
              全选
            </a-checkbox>
          </div>
          <br />
          <a-checkbox-group style="height:300px;overflow-y:auto;" :defaultValue="currentSelectFuncCols" :value="currentSelectFuncCols"
            @change="onSelectedModelFuncColumn" class="editarea">
            <a-checkbox style="margin-top:5px;margin-left:5px;width:95%" v-for="funcCol in currentModelBinding.modelFuncColumns"
              :checked="funcCol.isChoose" :value="funcCol.code" :key="funcCol.code">
              <span>
                {{getPropName(funcCol.code)}}
              </span>

              <span v-if="funcCol.isChoose" style="margin-left:30px">列公式:</span>
              <a-select v-if="funcCol.isChoose" :defaultValue="funcCol.func" size="small" style="margin-left:8px;width:200px"
                @change="(e)=>{onSelectColumnFunc(funcCol,e)}">
                <a-select-option v-for="colfunc in allColumnFuncs" :key="colfunc.name" :value="colfunc.val">{{colfunc.name}}</a-select-option>
              </a-select>

            </a-checkbox>
          </a-checkbox-group>
        </a-col>
      </a-row>
      <!-- ************************************************************ -->
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import ComponentBase from '../../04designerComponents/ComponentBase'
import PageBase from '../../05designerLayouts/PageBase'

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
  getAllFilters
} from '../../02common/commonClasses/modelBingding'
import modelAnalysis, { modelSimpleInfo } from '../../02common/impResourcesCache/modelAnalysis'

import modelChooseWindow from './modelChooseWindow.vue'
import AddBasemodel from '@/views/model/modules/AddBasemodel.vue'

@Component({
  components: {
    modelChooseWindow,
    AddBasemodel
  }
})
export default class editModelBindWindow extends Vue {
  private windowVisible: boolean = false
  private currentModelBinding: modelBingding
  private checkAll: boolean = false
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

  private getPropName(propertyCode: string) {
    // console.info('getPropNamegetPropNamegetPropName')
    if (!this.currentModelBinding || !this.currentModelBinding.modelAllProperties) {
      return ''
    }
    var find = this.currentModelBinding.modelAllProperties.find((o) => o.propertyCode == propertyCode)
    if (!find) {
      return '已删除'
    }
    return modelAnalysis.getModelPropertyShowName(find)
  }

  private currentSelectFuncCols: string[] = []
  private refreshCurrentSelectFuncCols() {
    this.currentSelectFuncCols = []
    if (this.currentModelBinding.modelBindingType == 2 || !this.currentModelBinding.modelFuncColumns) {
      return
    }
    this.currentModelBinding.modelFuncColumns.forEach((o) => {
      if (o.isChoose == true) {
        this.currentSelectFuncCols.push(o.code)
      }
    })
  }

  private startEdit(mb: modelBingding) {
    //window.console.log('开始编辑', mb)
    this.currentModelBinding = new modelBingding()
    this.currentModelBinding.clone(mb)

    this.windowVisible = true

    if (this.currentModelBinding.modelBindingType == 2) {
      return
    }

    if (this.currentModelBinding.modelFuncColumns) {
      this.currentModelBinding.modelAllProperties.forEach((t) => {
        var findColumnFunc = this.currentModelBinding.modelFuncColumns.find((o) => o.code == t.propertyCode)
        // if (!this.currentModelBinding.modelFuncColumns) {
        //   this.currentModelBinding.modelFuncColumns.push({ code: t.propertyCode, isChoose: true })
        // }
        if (!findColumnFunc) {
          this.currentModelBinding.modelFuncColumns.push({ code: t.propertyCode, isChoose: false })
        }
      })

      /** */
      var haves: any[] = []
      this.currentModelBinding.modelFuncColumns.filter((col) => {
        if (this.currentModelBinding.modelAllProperties.find((o) => o.propertyCode == col.code)) {
          haves.push(col)
        }
      })
      this.currentModelBinding.modelFuncColumns = haves
    } else {
      /** */
      this.currentModelBinding.modelFuncColumns = []
      this.currentModelBinding.modelAllProperties.forEach((o) => {
        this.currentModelBinding.modelFuncColumns.push({ code: o.propertyCode, isChoose: true })
      })
    }
    this.refreshCurrentSelectFuncCols()
    if (this.currentSelectFuncCols.length == this.currentModelBinding.modelFuncColumns.length) {
      this.checkAll = true
    }

    this.$forceUpdate()
  }

  private onSelectColumnFunc(funcColumn: modelFuncColumn, e?: funcColumnEnum) {
    //window.console.log('*********修改了列公式', e, funcColumn)
    var funcColumn = this.currentModelBinding.modelFuncColumns.find((o) => o.code == funcColumn.code)
    if (!funcColumn) {
      return
    }
    if (!e) {
      funcColumn.func = null
    } else {
      funcColumn.func = e
    }
  }

  private async onSelectedModelFuncColumn(propertyCodes: string[]) {
    // window.console.log('*********选择了函数列', propertyCodes)
    this.currentModelBinding.modelFuncColumns.forEach((o) => {
      if (propertyCodes.indexOf(o.code) > -1) {
        o.isChoose = true
      } else {
        o.isChoose = false
      }
      // o.func = null
    })
    this.refreshCurrentSelectFuncCols()
    // window.console.log('*********选择了函数', this.currentSelectFuncCols)
    this.$forceUpdate()
  }

  private onCheckAllChange(e) {
    this.checkAll = !this.checkAll
    if (this.checkAll) {
      let codes = this.currentModelBinding.modelFuncColumns.map((o) => o.code)
      this.onSelectedModelFuncColumn(codes)
    } else {
      this.onSelectedModelFuncColumn([])
    }
  }

  private async paramIsListChanged(val: any) {
    this.currentModelBinding.modelDataType = val.target.value
    this.$forceUpdate()
  }

  private onOk() {
    // window.console.log('修改模型实例成功')
    this.onSure(this.currentModelBinding)
    this.windowVisible = false
  }
  private onCancel() {
    this.windowVisible = false
  }

  private onEditModalSucceed(newmodel: any) {
    window.console.log('模型编辑完成:', newmodel)
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