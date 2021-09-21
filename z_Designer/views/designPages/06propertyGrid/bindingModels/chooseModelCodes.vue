<template>
  <div style="height:100%">
    <!-- /模型实例字段绑定/ -->
    <a-row v-if="currentModelDetailInfo" class="grow">
      <div class="flexHorilanLayout chooseheader">
        <div style="background:rgba(245,166,35,1);width:10px;height:24px;"></div>
        <span style="margin-left:18px;float:left;fontSize:18px;font-weight:600;color:rgba(0,0,0,0.85);">模型属性</span>
      </div>
      <a-checkbox-group :value="currentModelProperties" @change="onSelectedModelProperty" class="editarea">
        <a-checkbox v-for="property in modelPropries" :value="property" :key="property.propertyCode">
          {{ property.propertyName}}
        </a-checkbox>
      </a-checkbox-group>
    </a-row>
    <!-- /模型实例filter设置/ -->
    <a-row v-if="currentModelDetailInfo" class="grow">
      <div class="flexHorilanLayout chooseheader" style="justify-content:left;margin:6px 0px">
        <div style="background:rgba(245,166,35,1);width:10px;height:24px;"></div>
        <span style="margin-left:18px;float:left;fontSize:18px;font-weight:600;color:rgba(0,0,0,0.85);">筛选条件</span>
        <a-button style="margin-left:20px;width:104px;height:30px;background:rgba(245,166,35,1);border-color:rgb(245,166,35)" type="primary"
          @click="onAddModelFilter">
          <a-icon style="font-size:17px" :component="modelIco" />添加条件
        </a-button>
      </div>
      <a-radio-group style="width:100%" :multiple="false" v-model="controlPropertyBindModelInfo.modelFilterId" @change="onSelectedModelFilter"
        class="editarea">
        <a-radio class="np-model-filter-radio-item" v-for="filter in modelFilters" :value="filter.id" :key="filter.id"
          style="width:100%;margin:3px 0px;">
          <a-select size="small" style="margin-left:5px;width:300px" v-model="filter.code" @change="(e)=>{onFilterCodeChange(e,filter)}"
            optionFilterProp="children" show-search :filter-option="filterOption">
            <a-select-option v-for="property in modelPropries" :key="property.id" :value="property.propertyCode" :title="property.propertyName">
              {{ property.propertyName}}
            </a-select-option>
          </a-select>
          <a-select size="small" style="margin-left:5px;width:95px" v-model="filter.type" @change="(e)=>{onFilterTypeChange(e,filter)}">
            <a-select-option v-for="ship in allFilterShips" :key="ship.id" :value="ship.val">{{ship.name}}</a-select-option>
          </a-select>
          <span style="margin-left:5px;width:40px">绑定值</span>
          <a-select v-if="filter.combine" size="small" style="margin-left:5px;width:50px;" v-model="filter.combine"
            @change="(e)=>{onFilterCombineChange(e,filter)}">
            <a-select-option :key="1" :value="'AND'">且</a-select-option>
            <a-select-option :key="2" :value="'OR'">或</a-select-option>
          </a-select>
          <a-icon style="float:right;margin-top:5px;" type="close" @click="(e)=>{onRemoveFilter(e,filter)}" />
        </a-radio>
      </a-radio-group>
    </a-row>

    <!-- /模型实例orders设置/ -->
    <!-- <a-row v-show="false" class="grow">
      <div class="flexHorilanLayout chooseheader" style="justify-content:left;margin:6px 0px">
        <div style="background:#F5A623;width:6px;height:20px; "></div>
        <span style="margin-left:18px;float:left;fontSize:18px">排序字段</span>
      </div>
      <a-radio-group v-model="controlPropertyBindModelInfo.modelOrderCode" @change="onSelectedModelOrder" class="editarea">
        <a-radio v-for="order in modelOrders" :value="order.code" :key="order.code">
          {{order.name}}
        </a-radio>
      </a-radio-group>
    </a-row> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import ComponentBase from '../../04designerComponents/ComponentBase'
import PageBase from '../../03designerLayoutBase/PageBase'
import { CurrentApis, AuthorityCode } from '../../01designerContext'
import modelBingding, {
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
import modelAnalysis, { modelDetailInfo, ModelProperty, modelTypeEnum } from '../../02common/impResourcesCache/modelAnalysis'
import { Modal, notification } from 'ant-design-vue'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import {
  Property,
  PropertyType,
  Text_Property,
  Behavior_Property,
  Number_Property,
  PropertyGroupName,
  Color_Property,
  UploadFile_Property,
  Boolean_Property
} from '../../02common/commonClasses/LayoutProperty'
import { buttonAddIco } from '../../assets/icons.js'

@Component
export default class chooseModelCodes extends Vue {
  private modelIco: any = buttonAddIco
  @Prop() currentPage: PageBase
  /**当前的绑定信息 */
  @Prop() controlPropertyBindModelInfo: bindingModelVal_InProperty
  /**当前模型实例的模型详细信息 */
  @Prop() currentModelDetailInfo: modelDetailInfo

  get currentModelBindInPage(): modelBingding {
    if (!this.currentPage || !this.controlPropertyBindModelInfo) {
      return null
    }
    return this.currentPage.modelBindings.find((o) => o.modelBindingName == this.controlPropertyBindModelInfo.modelName)
  }

  /**当前选中的模型实例的所有属性 */
  get modelPropries(): ModelProperty[] {
    if (!this.currentModelBindInPage) {
      return []
    }
    // window.console.log('-------------------------------------modelPropries', this.currentModelDetailInfo.properties)
    return this.currentModelBindInPage.modelDetailProperties
  }
  get allFilterShips(): any[] {
    var res: any[] = []
    var allfilters = getAllFilters()

    allfilters.forEach((f) => {
      res.push({ id: common.getUuid(), val: f.val, name: f.name })
    })
    return res
  }
  /**当前所有的filter */
  get modelFilters(): modelFilter[] {
    if (!this.currentModelBindInPage) {
      return []
    }
    // window.console.log('this.currentModelBindInPage.modelFilters', this.currentModelBindInPage.modelFilters)
    return this.currentModelBindInPage.modelFilters
  }

  /**当前所有的filter */
  get modelOrders(): modelOrder[] {
    if (!this.currentModelBindInPage) {
      return []
    }

    this.currentModelBindInPage.modelOrders = this.currentModelBindInPage.modelOrders.filter((modelo) => {
      if (this.currentModelDetailInfo.properties.find((o) => o.propertyCode == modelo.code)) {
        return true
      } else {
        return false
      }
    })

    this.currentModelDetailInfo.properties.filter((property) => {
      var findInBindinfo = this.currentModelBindInPage.modelOrders.find((o) => o.code == property.propertyCode)
      if (!findInBindinfo) {
        this.currentModelBindInPage.modelOrders.push({ code: property.propertyCode, val: null })
      }
    })

    var res: any[] = []
    this.currentModelBindInPage.modelOrders.filter((o) => {
      var findproperty = this.currentModelDetailInfo.properties.find((p) => p.propertyCode == o.code)
      res.push({ code: o.code, val: o.val, name: findproperty.propertyName })
    })
    return res
  }

  /******************************************************************************************** */
  /**当前绑定的模型属性字段 */
  get currentModelProperties(): ModelProperty[] {
    // window.console.log('----------------当前绑定的属性字段')
    let res: ModelProperty[] = []
    if (!this.controlPropertyBindModelInfo) {
      return res
    }
    for (let index = 0; index < this.controlPropertyBindModelInfo.modelCodes.length; index++) {
      const codeinfo = this.controlPropertyBindModelInfo.modelCodes[index]
      var findproperty = this.modelPropries.find((o) => o.propertyCode == codeinfo.code)

      if (findproperty) {
        res.push(findproperty)
      }
    }
    return res
  }

  mounted() {
    // window.console.log('初始化模型字段选择', this.currentModelDetailInfo)
  }
  /**************************************************************** */
  private getModelName(modelId: string) {
    //Update By LH 2020/07/28
    var modelinfo = modelAnalysis.getModelInfoById(modelId, false)
    //var modelinfo = modelAnalysis.getModelInfoById(modelId)
    if (modelinfo) {
      return modelinfo.modelIndo.modelName
    } else {
      return ''
    }
  }

  private filterOption(input: any, option: any): any {
    return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  private onAddModelFilter() {
    // window.console.log('添加filter条件')
    var newfilter = new modelFilter()
    if (this.modelPropries.length < 1) {
      notification.warn({
        message: '系统提示',
        description: '此模型不能添加filter条件',
        duration: 4
      })
      return
    }

    newfilter.code = this.modelPropries[0].propertyCode
    newfilter.type = modelFilterTypeEnum.GE
    newfilter.combine = null
    newfilter.id = common.getUuid()

    if (this.currentModelBindInPage.modelFilters.length > 0) {
      var last = this.currentModelBindInPage.modelFilters[this.currentModelBindInPage.modelFilters.length - 1]
      last.combine = 'AND'
    }

    this.currentModelBindInPage.modelFilters.push(newfilter)
    this.$forceUpdate()
  }

  private onRemoveFilter(e: any, filter: any) {
    var findindex = this.currentModelBindInPage.modelFilters.findIndex((o) => o == filter)
    this.currentModelBindInPage.modelFilters.splice(findindex, 1)
    if (this.currentModelBindInPage.modelFilters.length > 0) {
      var last = this.currentModelBindInPage.modelFilters[this.currentModelBindInPage.modelFilters.length - 1]
      last.combine = null
    }
    this.$forceUpdate()
  }

  /**选择模型绑定字段 */
  private onSelectedModelProperty(selectProperties: ModelProperty[]) {
    // window.console.log('选择code')
    this.clearCurrentBindInfo()
    var res: modelCodeInfo[] = []
    for (let index = 0; index < selectProperties.length; index++) {
      const selectProperty = selectProperties[index]
      let property = this.modelPropries.find((o) => o.propertyCode == selectProperty.propertyCode)
      res.push({ code: property.propertyCode, codeName: property.propertyName, modelId: property.modelId })
    }
    this.controlPropertyBindModelInfo.modelCodes = res
    this.controlPropertyBindModelInfo.bindType = bindTypeEnum.code
    this.controlPropertyBindModelInfo.modelName = this.currentModelBindInPage.modelBindingName
  }
  private onSelectedModelFilter(val) {
    this.clearCurrentBindInfo()
    this.controlPropertyBindModelInfo.modelFilterId = val.target.value
    this.controlPropertyBindModelInfo.bindType = bindTypeEnum.filter
    this.controlPropertyBindModelInfo.modelName = this.currentModelBindInPage.modelBindingName
  }

  private onSelectedModelOrder(val) {
    this.clearCurrentBindInfo()
    this.controlPropertyBindModelInfo.modelOrderCode = val.target.value
    this.controlPropertyBindModelInfo.bindType = bindTypeEnum.order
    this.controlPropertyBindModelInfo.modelName = this.currentModelBindInPage.modelBindingName
  }

  private clearCurrentBindInfo() {
    this.controlPropertyBindModelInfo.modelFilterId = null
    this.controlPropertyBindModelInfo.modelCodes = []
    this.controlPropertyBindModelInfo.modelOrderCode = null
  }

  private onFilterCodeChange(e: any, filter: modelFilter) {
    //window.console.log(e)
    this.$forceUpdate()
  }
  private onFilterTypeChange(e: any, filter: modelFilter) {
    this.$forceUpdate()
  }

  private onFilterCombineChange(e: any, filter: modelFilter) {
    this.$forceUpdate()
  }
}
</script>



<style scoped>
@import '../../assets/globlaTheme.less';

.ant-checkbox-wrapper {
  margin-left: 8px;
  width: 100%;
}
.ant-radio-wrapper {
  margin-left: 8px;
  width: 100%;
}

.grow {
  position: relative;
  height: 48%;
}

.editarea {
  overflow-y: auto;
  position: absolute;
  top: 35px;
  bottom: 0px;
  padding: 6px;
}

.chooseheader {
  justify-content: left;
  margin: 6px 0px;
  height: 35px;
}

.np-model-filter-radio-item:hover {
  background: #bae7ff;
}
</style>