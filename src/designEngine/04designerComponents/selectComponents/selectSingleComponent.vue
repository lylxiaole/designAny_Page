/** 
title用来存储选中的对象信息 2020-03-05 add
*/
<template>
  <!-- <div> -->
  <!-- <span v-if="isStem!==true"> -->
  <a-select v-if="isStem!==true" v-model="vmodel" :showSearch="showSearch"
    :style="{width: '100%',fontSize:fontSize+'px',color:fontColor,padding:0+'px',zIndex:100}" :disabled="disabled" :size="size" :mode="mode"
    :placeholder="placeholder" :allowClear="allowClear" @change="handleChange" @select="onSelect" :options="options"
    :getPopupContainer="PopupContainer">
  </a-select>
  <!-- </span> -->
  <!-- <span v-else class='Gsel'> -->
  <a-select v-else v-model="vmodel" :showSearch="showSearch" :style="{width: '100%',fontSize:fontSize+'px',color:fontColor,padding:0+'px',zIndex:100}"
    :disabled="disabled" :size="size" :mode="mode" :placeholder="placeholder" :allowClear="allowClear" optionFilterProp="children"
    @change="handleChange" @select="onSelect" :getPopupContainer="PopupContainer">
    <a-select-option v-for="item in dictOptions" :key="item.item_value" :value="item.item_value" :item="item" :title="item.item_name">
      <!-- <span style="display: inline-block;width: 100%"></span> -->
      {{item.item_name}}
    </a-select-option>
  </a-select>
  <!-- </span> -->
  <!-- </div> -->
</template>
<script lang="ts">
//:maxTagTextLength="maxTagTextLength" labelInValue  :filterOption="filterOption"
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Number_Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  UploadFile_Property,
  Color_Property,
  Button_Property,
  PageInParams_Property,
  Boolean_Property,
  Select_Property,
  selectDict_Property
} from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import { param, paramType } from '../../03designerLayoutBase'
import selectElementInfo from '../../02common/commonClasses/selectElementInfo'
import { CurrentApis, CurrentContext } from '../../01designerContext'
import { bindTypeEnum } from '../../02common/commonClasses/modelBingding'
import { ModelPropertyType } from '../../02common/impResourcesCache/modelAnalysis'
import { dictCache, functionCache, modelMapperCache } from '../../02common/impResourcesCache/'
import common from '../../02common/commonMethod'

class selectData {
  label: string
  value: string
  disabled: boolean
}

// enum propertyOptionsEnum {
//   options = '下拉列表数据源',
// }

@Component
export default class SelectComponent extends ComponentBase {
  inparam: param[]
  outparam: param
  PopupContainer: any = (trigger) => {
    let layers = document.getElementsByClassName('layui-layer-content')
    let layerLength = layers.length
    if (layerLength > 0) {
      return layers[layerLength - 1]
    } else {
      return document.body
    }
  }
  //PopupContainer: any = (trigger) => trigger.parentNode
  //vmodel: any = ''
  @Prop()
  dictID: string
  // selectEleDisabled: boolean = false
  @Prop()
  value: string
  //@Prop() dictID: string = undefined
  @Prop() addDefaultItem: boolean

  private dictOptions: any[] = []
  private selectDefault: {} = {}

  @Watch('value')
  valueChange() {
    //window.console.log('------------------触发选择框变更了')
    this.vmodel = this.value
  }

  @Watch('dictID')
  changVal() {
    if (this.dictID !== undefined) {
      this.initDictData()
    }
  }

  mounted() {
    //注册属性
    // if (this.dictID !== undefined) {
    //   this.registerProperty('数据源', PropertyGroupName.special, null, null, true, false)
    // } else {
    //   this.registerProperty('数据源', PropertyGroupName.special, null, null, true, true)
    // }
    this.registerProperty('数据源', PropertyGroupName.special, null, null, true, true)
    //this.registerProperty('是否禁用', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('是否内置', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('是否默认展开下拉菜单', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('是否允许清空选择框', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('是否默认高亮第一个选项', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('选择框默认文字', PropertyGroupName.special, new Text_Property(), '请选择')
    this.registerProperty('下拉列表为空默认显示内容', PropertyGroupName.special, new Text_Property(), '请添加选项')
    this.registerProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, ['大', '中', '小']), '中')
    this.registerProperty(
      '选择器模式',
      PropertyGroupName.special,
      new Enum_Property(true, ['单选模式', '多选模式', '标签模式', '组合框模式']),
      '单选模式',
      false
    )
    this.registerProperty('是否具备搜索功能', PropertyGroupName.special, new Boolean_Property(), true)
    // this.registerProperty('是否按照菜单显示项搜索', PropertyGroupName.special, new Boolean_Property(), true)
    // this.registerProperty('是否在选中项后清空搜索框', PropertyGroupName.special, new Boolean_Property(), true)
    // this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
    // this.registerProperty('最多显示标签数(个)', PropertyGroupName.special, new Number_Property(), 5)
    // this.findPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').canSetting = false
    // this.registerProperty('最大显示的tag文本长度(字符)', PropertyGroupName.special, new Number_Property(), 5)
    // this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度(字符)').canSetting = false

    //this.registerProperty('后缀图标', PropertyGroupName.special, new Enum_Property(true, ['微笑', '不悦', '上箭头', '下箭头']), '微笑')
    //this.registerProperty('当前选中条目图标', PropertyGroupName.special, new Enum_Property(true, ['圆形对号', '方形对号', '对号']), '圆形对号')
    //this.registerProperty('多选的清除图标', PropertyGroupName.special, new Enum_Property(true, ['圆形叉号', '方形叉号', '叉号']), '圆形叉号')
    //this.registerProperty('清空图标', PropertyGroupName.special, new Enum_Property(true, ['圆形叉号', '方形叉号', '叉号']), '圆形叉号')
    this.registerProperty('选择枚举', PropertyGroupName.special, new selectDict_Property())
    this.registerProperty('当前选项值', PropertyGroupName.special, null, '', true, true)
    this.registerProperty('当前选中模型', PropertyGroupName.special, null, null)
    //this.findPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = false
    //this.findPropertyByName(PropertyGroupName.special, '清空图标').canSetting = false
    //this.findPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = false
    // this.registerProperty('设置属性', PropertyGroupName.special, new Select_Property())
    //注册事件
    this.registerEvents('值改变事件', '', this.inparam, this.outparam)
    //this.registerEvents('下拉列表滚动事件', '', this.inparam, this.outparam)
    //this.registerEvents('搜索事件', '', this.inparam, this.outparam)
    //this.registerEvents('被选中事件', '', this.inparam, this.outparam)
    //this.registerEvents('取消选中事件', '', this.inparam, this.outparam)
    //this.registerEvents('键盘按下事件', '', this.inparam, this.outparam)
    //this.registerEvents('鼠标移入事件', '', this.inparam, this.outparam)
    //this.registerEvents('鼠标移出事件', '', this.inparam, this.outparam)

    //this.registerEvents('扩展选项事件', '', this.inparam, this.outparam)
    //this.triggeEvent('扩展选项事件', null)
    //添加监听
    //this.$watch('selectInfos', this.watchSelectInfos, { deep: true })
    //属性改变
    this.initDictData()
    if (this.curModelproperty && this.curModelproperty.defaultValue) {
      this.vmodel = this.curModelproperty.defaultValue + ''
    }
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
    // if (this.parentPage) {
    //   this.parentPage.$watch('modelBindings', this.onPageModelBindChanged, { deep: true })
    // }
  }

  protected loadCompleted(childrenData: any[]) {
    // if (!this.IsDesigning) {
    //   let level = this.findPropertyByName(PropertyGroupName.normal, '层级设置')
    //   this.setPropertyVal(level.id,10)
    //   window.console.log('----------------下拉框层级',level.value)
    // }
    let property = this.findPropertyByName(PropertyGroupName.special, '数据源')
    if (property) {
      //this.setPropertyVal(property.id,[])
      if (property.value) {
        //this.setPropertyVal(property.id, property.value)
        this.dictOptions = property.value
        var bindinfo = this.getPropertyBindInfo(property.id)
        if (!bindinfo) {
          return
        }
        let modelbindInfo = this.parentPage.getModelBindInfo(bindinfo)
        this.parentPage.setModelBindVal(bindinfo.modelName, property.value, property.id)
      }
    }
    // if (!this.vmodel){
    //   var property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    //   this.setPropertyVal(property.id, this.vmodel)
    // }
  }

  //监听属性变更，用于特殊处理
  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    //window.console.log('绑定模型变更-xxxxx', property)
    //var page = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    //当前选项值绑定模型属性或者筛选条件的时候，都可直接关联数据源
    switch (property.propertyName) {
      case '绑定模型': {
        window.console.log('----------------------------xxxxxxxxxx当前选项值属性变更-property', property)
        //this.bindInfos
        //window.console.log('----------------------------xxxxxxxxxx当前选项值属性变更-this.bindInfos', this.bindInfos)
        if (!property.value || property.value.length === 0) {
          return
        }
        // let temp = this.bindInfos.find(item=>item.modelName != '')
        // window.console.log('----------------------------xxxxxxxxxx当前选项值属性变更-temp', temp)
        let tempproperty = property.value.find((item) => item.modelName != '')
        if (!tempproperty) {
          break
        }
        //window.console.log('----------------------------xxxxxxxxxx当前选项值属性变更-temp', tempproperty)
        var modelBind = this.parentPage.modelBindings.find((o) => o.modelBindingName == tempproperty.modelName)
        var aray = []
        if (modelBind) {
          //绑定筛选条件
          if (tempproperty.bindType === bindTypeEnum.filter) {
            if (modelBind.modelFilters && modelBind.modelFilters.length > 0) {
              //window.console.log('当前选项值属性变更', modelBind.modelFilters)
              //property
              let filter = modelBind.modelFilters.find((item) => item.id === tempproperty.modelFilterId)
              if (!filter) {
                return
              }
              //window.console.log('----------------------------当前选项值属性变更-property', tempproperty.modelFilterId)
              let enumProp = modelBind.modelDetailInfo.modelPropertyList.find((item) => item.propertyCode === filter.code)
              //window.console.log('----------------------------当前选项值属性变更-enumProp', enumProp)
              if (!enumProp) {
                return
              }
              if (enumProp && enumProp.propertyType === ModelPropertyType.ENUM && enumProp.dictId) {
                this.dictID = enumProp.dictId
              } else {
                //window.console.log('筛选条件变更', enumProp)
                //propertyType
                if (enumProp.propertyType === ModelPropertyType.BOOL) {
                  aray.push(
                    {
                      item_name: '是',
                      item_value: '1'
                    },
                    {
                      item_name: '否',
                      item_value: '0'
                    }
                  )
                  this.dictOptions = aray
                  if (this.findPropertyByName(PropertyGroupName.special, '数据源')) {
                    this.findPropertyByName(PropertyGroupName.special, '数据源').value = aray
                  }
                }
              }
            }
          }
          //也可以绑定数据源，非表单操作
          if (tempproperty.bindType === bindTypeEnum.code) {
            if (tempproperty.modelCodes && tempproperty.modelCodes.length > 0) {
              //window.console.log('----------------------------当前选项值属性变更-property', property.value[0].modelFilterId)
              let enumProp = modelBind.modelDetailInfo.modelPropertyList.find((item) => item.propertyCode === tempproperty.modelCodes[0].code)
              //window.console.log('----------------------------当前选项值属性变更-enumProp', enumProp)
              if (!enumProp) {
                return
              }
              if (enumProp && enumProp.propertyType === ModelPropertyType.ENUM && enumProp.dictId) {
                this.dictID = enumProp.dictId
              } else {
                //window.console.log('筛选条件变更', enumProp)
                //propertyType
                if (enumProp.propertyType === ModelPropertyType.BOOL) {
                  aray.push(
                    {
                      item_name: '是',
                      item_value: '1'
                    },
                    {
                      item_name: '否',
                      item_value: '0'
                    }
                  )
                  this.dictOptions = aray
                  if (this.findPropertyByName(PropertyGroupName.special, '数据源')) {
                    this.findPropertyByName(PropertyGroupName.special, '数据源').value = aray
                  }
                }
              }
            }
          }
        }
        //window.console.log('绑定属性',modelBind)
        break
      }
      case '数据源':
        if (property.value) {
          //this.dictOptions = property.value
          //window.console.log('--------------------------------下拉框数据源变更了', property.value)
          this.dictOptions = property.value
          var property111 = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
          //window.console.log('--------------------------------下拉框数据源变更了当前选项值xxxx', property111.value)
        } else {
          //window.console.log('--------------------------------下拉框数据源变更为空')
          this.dictOptions = []
          //var property111 = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
          //window.console.log('--------------------------------下拉框数据源变更了当前选项值xxxx', property111.value)
        }
        break
      case '选择枚举':
        this.dictID = property.value
        break
      case '当前选项值':
        var property11 = this.findPropertyByName(PropertyGroupName.special, '数据源')

        //默认把当前选项值也更新
        var property111 = this.findPropertyByName(PropertyGroupName.special, '当前选中模型')

        if (property111) {
          if (property11 && property11.value) {
            let ttt = property11.value.find((item) => item.item_value == property.value)
            if (ttt) {
              this.setPropertyVal(property111.id, ttt)
            } else {
              this.setPropertyVal(property111.id, {})
            }
          } else {
            this.setPropertyVal(property111.id, {})
          }
        }

        break
    }
  }

  private onPageModelBindChanged(newval: any) {
    //window.console.log('筛选条件变更', newval)
    var modelBind = newval.find((o) => o.modelBindingName == this.bindInfos[0].modelName)
    if (modelBind) {
      // if (property.value[0].bindType === bindTypeEnum.filter) {

      // }
      if (modelBind.modelFilters && modelBind.modelFilters.length > 0) {
        let property = this.findPropertyByName(PropertyGroupName.normal, '绑定模型')
        if (property) {
          return
        }
        //indow.console.log('')
        let filter = modelBind.modelFilters.find((item) => item.id === property.value[0].modelFilterId)
        if (!filter) {
          return
        }
        let enumProp = modelBind.modelDetailInfo.modelPropertyList.find((item) => item.propertyCode === modelBind.modelFilters[0].code)
        if (enumProp && enumProp.dictId) {
          this.dictID = enumProp.dictId
        } else {
          if (enumProp.propertyType === ModelPropertyType.BOOL) {
            var aray = []
            aray.push(
              {
                item_name: '是',
                item_value: '1'
              },
              {
                item_name: '否',
                item_value: '0'
              }
            )
            this.dictOptions = aray
            if (this.findPropertyByName(PropertyGroupName.special, '数据源')) {
              this.findPropertyByName(PropertyGroupName.special, '数据源').value = aray
            }
          }
        }
      }
    }
  }

  //事件
  private handleChange(value: any, option: any) {
    var property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    if (value === undefined) {
      value = null
      this.setPropertyVal(property.id, value, true, true)
    } else {
      this.setPropertyVal(property.id, value)
    }
    // console.log(value)
    //当前选中模型
    var property111 = this.findPropertyByName(PropertyGroupName.special, '当前选中模型')
    if (property111) {
      if (option) {
        this.setPropertyVal(property111.id, option.data.attrs.item)
      } else {
        this.setPropertyVal(property111.id, {})
      }
    }
    if (option) {
      //window.console.log('---------------------------------------------当前选项111', option.data.attrs.item)
    }
    //window.console.log('---------------------------------------------触发下拉框值改变事件', value)
    this.$emit('change', value)
    this.triggeEvent('值改变事件', null)
  }

  //被选中是触发的事件
  private onSelect(value: any, option: any) {
    //this.triggeEvent('被选中事件', null)
  }
  //下拉列表滚动事件
  private popupScroll() {
    this.triggeEvent('下拉列表滚动事件', null)
  }
  //搜索事件
  private onSearch(value: any) {
    this.triggeEvent('搜索事件', null)
  }

  private deselect(value: any, option: any) {
    //this.triggeEvent('取消选中事件', null)
  }

  private inputKeydown() {
    this.triggeEvent('键盘按下事件', null)
  }

  private mouseenter() {
    this.triggeEvent('鼠标移入事件', null)
  }

  private mouseleave() {
    this.triggeEvent('鼠标移出事件', null)
  }
  // get selectInfos(): selectElementInfo[] {
  //   var val
  //   if (this.findProperties(PropertyGroupName.special, '设置属性')[0]) {
  //     val = this.findProperties(PropertyGroupName.special, '设置属性')[0].value
  //   }
  //   if (!val) {
  //     return
  //   }
  //   return val as selectElementInfo[]
  // }
  private initDictData() {
    let aray = []
    if (this.addDefaultItem) {
      aray.push({ item_name: '请选择', item_value: '-1' })
    }
    let param = {
      filter: [
        {
          code: 'sys_dict_view__id',
          value: this.dictID,
          type: 'EQ'
        }
      ],
      modelCode: 'DictView'
    }
    if (!this.dictID) return

    // let dict = CurrentApis.GetSysDictById(this.dictID) as any
    let dict = dictCache.getSystemDictById_Sync(this.dictID) as any
    if (dict) {
      let itemList = dict
      itemList.forEach((item) => {
        if (!item.deleted) {
          aray.push({
            item_name: item.item_name,
            item_value: item.item_value + ''
          })
        }
      })

      this.dictOptions = aray
      let prop = this.findPropertyByName(PropertyGroupName.special, '数据源')
      if (prop) {
        this.setPropertyVal(prop.id, aray)
      }
      //window.console.info('-------------------------------------数据源xxxxxx', Object.assign(aray))
      //this.triggeEvent('控件加载完成事件', null)
    }
    //window.console.log('------------下拉框新接口查询结果',dict)
  }

  /**需要绑定选中值 */
  public get validateProperty(): Property {
    var property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    return property
  }
  get vmodel(): any {
    var property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    if (property && property.value != undefined && property.value.itemValue !== undefined) {
      //let prop = Object.assign(property)
      //this.findPropertyByName(PropertyGroupName.special, '当前选项值').value = prop.value.itemValue + ''
      this.setPropertyVal(property.id, property.value.itemValue + '')
      // let bind = this.bindInfos[0]
      // let modelInfo = this.parentPage.modelBindings.find((item) => item.modelBindingName === bind.modelName)
      // if (modelInfo) {
      //   let code = bind.modelCodes[0].code
      //   if (modelInfo.val.data[code].itemValue != undefined) {
      //     modelInfo.val.data[code] = modelInfo.val.data[code].itemValue + ''
      //   }
      // }
    }
    if (property && this.checkIsNull(property.value)) {
      this.setPropertyVal(property.id, null)
    }
    //window.console.log('------------------------------获取当前选项值property', property)
    let ttt = property ? (!this.checkIsNull(property.value) ? property.value + '' : undefined) : undefined
    //window.console.log('------------------------------获取当前选项值property-ttt', ttt)
    //当前选中模型
    var property111 = this.findPropertyByName(PropertyGroupName.special, '当前选中模型')
    if (!ttt && property111) {
      this.setPropertyVal(property111.id, {})
    } else {
      //根据数据源来匹配
      if (ttt && this.dictOptions.length > 0) {
        let selectoption = this.dictOptions.find((item) => item.item_value == ttt)
        this.setPropertyVal(property111.id, selectoption)
      }
    }
    return ttt
  }
  set vmodel(val: any) {
    var property = this.findPropertyByName(PropertyGroupName.special, '当前选项值')
    this.setPropertyVal(property.id, val)
  }
  get options(): selectData {
    if (this.findProperties(PropertyGroupName.special, '数据源')[0]) {
      return this.findProperties(PropertyGroupName.special, '数据源')[0].value
    }
    return null
  }

  get isStem(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否内置')[0]) {
      return this.findProperties(PropertyGroupName.special, '是否内置')[0].value as boolean
    }
    return false
  }

  //选择框的默认文字
  get placeholder(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '选择框默认文字')) {
      return this.findPropertyByName(PropertyGroupName.special, '选择框默认文字').value as string
    }
    return '请选择'
  }
  //下拉列表为空时，显示的内容
  get notFoundContent(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '下拉列表为空默认显示内容')) {
      return this.findPropertyByName(PropertyGroupName.special, '下拉列表为空默认显示内容').value as string
    }
    return '请添加选项'
  }
  //禁用属性
  // get disabled(): boolean {
  //   if (this.findPropertyByName(PropertyGroupName.special, '是否禁用')) {
  //     return this.findPropertyByName(PropertyGroupName.special, '是否禁用').value as boolean
  //   }
  // }
  //清空选择框属性
  get allowClear(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否允许清空选择框')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否允许清空选择框').value as boolean
    }
    return false
  }
  // @Watch('allowClear')
  // watchAllowClear() {
  //   if (this.allowClear) {
  //     this.findPropertyByName(PropertyGroupName.special, '清空图标').canSetting = true
  //   } else {
  //     this.findPropertyByName(PropertyGroupName.special, '清空图标').canSetting = false
  //   }
  // }

  //高亮第一个选项
  get defaultActiveFirstOption(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否默认高亮第一个选项')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否默认高亮第一个选项').value as boolean
    }
    return false
  }
  //大小属性
  get size(): string {
    if (this.findProperties(PropertyGroupName.special, '尺寸')[0]) {
      return (this.findProperties(PropertyGroupName.special, '尺寸')[0].value as string) == '大'
        ? 'large'
        : (this.findProperties(PropertyGroupName.special, '尺寸')[0].value as string) == '中'
        ? 'default'
        : 'small'
    }
    return 'default'
  }
  //模式属性
  get mode(): string {
    // if (this.findPropertyByName(PropertyGroupName.special, '选择器模式')) {
    //   if ((this.findPropertyByName(PropertyGroupName.special, '选择器模式').value as string) == '单选模式') {
    //     this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = true
    //     this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = false
    //     this.findPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').canSetting = false
    //     this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
    //     return 'default'
    //   }
    // }
    return 'default'
  }
  //单选模式的搜索功能
  get showSearch(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能')) {
      // if (this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').value as boolean) {
      //   this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = true
      // } else {
      //   this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = false
      // }
      return this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').value as boolean
    }
    return true
  }

  get optionFilterProp(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索')) {
      return (this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').value as boolean) ? 'children' : 'value'
    }
    return 'children'
  }
  // //单选模式的后缀图标
  // get icon(): string {
  //   if (this.findProperties(PropertyGroupName.special, '后缀图标')[0]) {
  //     if ((this.findProperties(PropertyGroupName.special, '后缀图标')[0].value as string) == '微笑') {
  //       return 'smile'
  //     } else if ((this.findPropertyByName(PropertyGroupName.special, '后缀图标').value as string) == '不悦') {
  //       return 'frown'
  //     } else if ((this.findPropertyByName(PropertyGroupName.special, '后缀图标').value as string) == '上箭头') {
  //       return 'up-circle'
  //     } else {
  //       return 'down-circle'
  //     }
  //   }
  //   return ''
  // }
  // //多选模式的当前选中图标
  // get selectedIcon(): string {
  //   if (this.findProperties(PropertyGroupName.special, '当前选中条目图标')[0]) {
  //     if ((this.findProperties(PropertyGroupName.special, '当前选中条目图标')[0].value as string) == '圆形对号') {
  //       return 'check-circle'
  //     } else if ((this.findProperties(PropertyGroupName.special, '当前选中条目图标')[0].value as string) == '方形对号') {
  //       return 'check-square'
  //     } else {
  //       return 'check'
  //     }
  //   }
  //   return ''
  // }
  // //多选模式的清除图标
  // get removeIcon(): string {
  //   if (this.findProperties(PropertyGroupName.special, '多选的清除图标')[0]) {
  //     if ((this.findProperties(PropertyGroupName.special, '多选的清除图标')[0].value as string) == '圆形叉号') {
  //       return 'close-circle'
  //     } else if ((this.findProperties(PropertyGroupName.special, '多选的清除图标')[0].value as string) == '方形叉号') {
  //       return 'close-square'
  //     } else {
  //       return 'close'
  //     }
  //   }
  //   return ''
  // }

  // //多选模式的清空图标
  // get clearIcon(): string {
  //   if (this.findProperties(PropertyGroupName.special, '清空图标')[0]) {
  //     if ((this.findProperties(PropertyGroupName.special, '清空图标')[0].value as string) == '圆形叉号') {
  //       return 'close-circle'
  //     } else if ((this.findProperties(PropertyGroupName.special, '清空图标')[0].value as string) == '方形叉号') {
  //       return 'close-square'
  //     } else {
  //       return 'close'
  //     }
  //   }
  //   return ''
  // }

  //tag模式的最大tag数量
  get maxTagCount(): number {
    if (this.findPropertyByName(PropertyGroupName.special, '最多显示标签数(个)')) {
      return this.findPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').value as number
    }
    return 1
  }
  //最大显示的tag文本长度
  // get maxTagTextLength(): number {
  //   if (this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度')) {
  //     return this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').value as number
  //   }
  // }
  //是否在选中项后清空搜索框,只在mode是tag或multipe模式下有效
  get autoClearSearchValue(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').value as boolean
    }
    return false
  }

  //字体大小
  get fontSize(): string {
    if (this.findPropertyByName(PropertyGroupName.normal, '字体')) {
      return this.findPropertyByName(PropertyGroupName.normal, '字体').value as string
    }
    return '14'
  }

  get fontColor(): string {
    if (this.findPropertyByName(PropertyGroupName.normal, '前景色')) {
      return this.findPropertyByName(PropertyGroupName.normal, '前景色').value as string
    }
    return '#000000'
  }
  //是否默认展开下拉菜单
  get defaultOpen(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否默认展开下拉菜单')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否默认展开下拉菜单').value as boolean
    }
    return false
  }
  private checkIsNull(obj: any): boolean {
    let res = true
    if (obj === undefined || obj === null || obj === '') {
      return true
    }
    if (obj instanceof Object) {
      if (Object.keys(obj).length == 0) {
        return true
      }
    }
    if (obj instanceof Array) {
      if (obj.length == 0) {
        return true
      }
    }
    return false
  }
}
</script>
<style lang='less'>
form .has-feedback > .ant-select .ant-select-arrow,
form .has-feedback > .ant-select .ant-select-selection__clear,
form .has-feedback :not(.ant-input-group-addon) > .ant-select .ant-select-arrow,
form .has-feedback :not(.ant-input-group-addon) > .ant-select .ant-select-selection__clear {
  right: 11px;
}
.ant-select-disabled .ant-select-selection {
  background: rgba(0, 0, 0, 0.05) !important;
  color: #b7b7b7;
}
</style>