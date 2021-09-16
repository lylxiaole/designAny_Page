/** 
多选下拉框组件
xuww add 2020-02-22
*/
<template>
  <a-select v-if="isStem!==true" v-model="vmodel" :showSearch="showSearch"
    :style="{width: '100%',fontSize:fontSize+'px',color:fontColor,padding:0+'px'}" :disabled="disabled" :size="size" :mode="mode"
    :placeholder="placeholder" :allowClear="allowClear" :maxTagCount="maxTagCount" :defaultOpen="defaultOpen" :notFoundContent="notFoundContent"
    :autoClearSearchValue="autoClearSearchValue" dropdownMatchSelectWidth @change="handleChange" :getPopupContainer="PopupContainer">
  </a-select>
  <a-select v-else v-model="vmodel" :showSearch="showSearch" :style="{width: '100%',fontSize:fontSize+'px',color:fontColor,padding:0+'px'}"
    :disabled="disabled" :size="size" mode="multiple" :placeholder="placeholder" :allowClear="allowClear" :maxTagCount="maxTagCount"
    :notFoundContent="notFoundContent" :autoClearSearchValue="autoClearSearchValue" dropdownMatchSelectWidth @change="handleChange" :title="showName"
    :getPopupContainer="PopupContainer">
    <a-select-option v-for="item in dictOptions" :key="item.item_value">
      <span style="display: inline-block;width: 100%">{{item.item_name}}</span>
    </a-select-option>
  </a-select>
</template>
<script lang="ts">
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
} from '../../02common/commonClasses/LayoutProperty'
import ComponentBase from '../ComponentBase'
import { param, paramType } from '../../02common/commonClasses/layoutEvent'
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
export default class SelectMultipleComponent extends ComponentBase {
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

  showName: string = ''

  @Watch('value')
  valueChange() {
    //window.console.log('------------------触发选择框变更了')
    //如果选中值是个数组，就一个个的追加
    if (this.value) {
      this.value.split(',').forEach((item) => {
        this.vmodel.push(item)
      })
    }
  }

  @Watch('dictID')
  changVal() {
    if (this.dictID !== undefined) {
      this.initDictData()
    }
  }

  mounted() {
    //注册属性
    this.RegisterProperty('数据源', PropertyGroupName.special, null, null, true, true)
    this.RegisterProperty('是否内置', PropertyGroupName.special, new Boolean_Property(), true)
    this.RegisterProperty('是否默认展开下拉菜单', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('是否允许清空选择框', PropertyGroupName.special, new Boolean_Property(), true)
    this.RegisterProperty('是否默认高亮第一个选项', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('选择框默认文字', PropertyGroupName.special, new Text_Property(), '请选择')
    this.RegisterProperty('下拉列表为空默认显示内容', PropertyGroupName.special, new Text_Property(), '请添加选项')
    this.RegisterProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, ['大', '中', '小']), '中')
    this.RegisterProperty('是否具备搜索功能', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('是否按照菜单显示项搜索', PropertyGroupName.special, new Boolean_Property(), true)
    this.RegisterProperty('是否在选中项后清空搜索框', PropertyGroupName.special, new Boolean_Property(), true)
    //this.FindPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
    this.RegisterProperty('最多显示标签数(个)', PropertyGroupName.special, new Number_Property(), 2)
    //this.FindPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').canSetting = false
    this.RegisterProperty('选择枚举', PropertyGroupName.special, new selectDict_Property())
    this.RegisterProperty('当前选项值', PropertyGroupName.special, null, undefined, true, true)
    //注册事件
    this.RegisterEvents('值改变事件', '', this.inparam, this.outparam)
    //this.RegisterEvents('下拉列表滚动事件', '', this.inparam, this.outparam)
    //this.RegisterEvents('搜索事件', '', this.inparam, this.outparam)
    //this.RegisterEvents('被选中事件', '', this.inparam, this.outparam)
    //this.RegisterEvents('取消选中事件', '', this.inparam, this.outparam)
    //this.RegisterEvents('键盘按下事件', '', this.inparam, this.outparam)
    //this.RegisterEvents('鼠标移入事件', '', this.inparam, this.outparam)
    //this.RegisterEvents('鼠标移出事件', '', this.inparam, this.outparam)

    //this.RegisterEvents('扩展选项事件', '', this.inparam, this.outparam)
    //this.TriggeEvent('扩展选项事件', null)
    //添加监听
    //this.$watch('selectInfos', this.watchSelectInfos, { deep: true })
    //属性改变
    this.initDictData()
    if (this.curModelproperty && this.curModelproperty.defaultValue) {
      let temp = []
      // if (!this.vmodel){
      //   temp = []
      // }
      temp.push(this.curModelproperty.defaultValue + '')
      this.vmodel = temp
    }
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
  }

  protected loadCompleted(childrenData: any[]) {
    if (this.FindPropertyByName(PropertyGroupName.special, '数据源')) {
      let property = this.FindPropertyByName(PropertyGroupName.special, '数据源')
      //window.console.log('--------------------------枚举数据源-----------------------------------', property)
      if (property.value) {
        //this.SetPropertyVal(property.id, property.value)
        this.dictOptions = property.value
        var bindinfo = this.getPropertyBindInfo(property.id)
        if (!bindinfo) {
          return
        }
        let modelbindInfo = this.parentPage.getModelBindInfo(bindinfo)
        this.parentPage.setModelBindVal(bindinfo.modelName, property.value, property.id)
      }
    }
  }

  //监听属性变更，用于特殊处理
  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    switch (property.propertyName) {
      case '绑定模型':
        //window.console.log('----------------------------xxxxxxxxxx当前选项值属性变更-property', property)
        if (!this.bindInfos || this.bindInfos.length <= 0) {
          return
        }
        var modelBind = this.parentPage.modelBindings.find((o) => o.modelBindingName == this.bindInfos[0].modelName)
        if (modelBind) {
          if (property.value.length > 0 && property.value[0].bindType === bindTypeEnum.filter) {
            if (modelBind.modelFilters && modelBind.modelFilters.length > 0) {
              //window.console.log('当前选项值属性变更', modelBind.modelFilters)
              //property
              let filter = modelBind.modelFilters.find((item) => item.id === property.value[0].modelFilterId)
              if (!filter) {
                return
              }
              //window.console.log('----------------------------当前选项值属性变更-property', property.value[0].modelFilterId)
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
                  if (this.FindPropertyByName(PropertyGroupName.special, '数据源')) {
                    this.FindPropertyByName(PropertyGroupName.special, '数据源').value = aray
                  }
                }
              }
            }
          }
          //也可以绑定数据源，非表单操作
          if (property.value.length > 0 && property.value[0].bindType === bindTypeEnum.code) {
            if (property.value[0].modelCodes && property.value[0].modelCodes.length > 0) {
              //window.console.log('----------------------------当前选项值属性变更-property', property.value[0].modelFilterId)
              let enumProp = modelBind.modelDetailInfo.modelPropertyList.find((item) => item.propertyCode === property.value[0].modelCodes[0].code)
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
                  if (this.FindPropertyByName(PropertyGroupName.special, '数据源')) {
                    this.FindPropertyByName(PropertyGroupName.special, '数据源').value = aray
                  }
                }
              }
            }
          }
        }
        //window.console.log('绑定属性',modelBind)
        break
      case '数据源':
        if (property.value && property.value.length > 0) {
          //this.dictOptions = property.value
          //window.console.log('--------------------------------下拉框数据源变更了', property.value)
          this.dictOptions = property.value
          // var aray = []
          // aray.push(
          //   {
          //     item_name: '原料',
          //     item_value: '0',
          //   },
          //   {
          //     item_name: '成品',
          //     item_value: '1',
          //   }
          // )
          // this.dictOptions = aray
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
        let property = this.FindPropertyByName(PropertyGroupName.normal, '绑定模型')
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
            if (this.FindPropertyByName(PropertyGroupName.special, '数据源')) {
              this.FindPropertyByName(PropertyGroupName.special, '数据源').value = aray
            }
          }
        }
      }
    }
  }

  //事件
  private handleChange(value: any) {
    // console.log(value)
    // var property = this.FindPropertyByName(PropertyGroupName.special, '当前选项值')
    // this.SetPropertyVal(property.id, value)
    // window.console.log('---------------------------------------------当前选项值', value)
    // this.$emit('change', value)
    // this.TriggeEvent('值改变事件', null)
  }

  //被选中是触发的事件
  private onSelect(value: any, option: any) {
    this.TriggeEvent('被选中事件', null)
  }

  //下拉列表滚动事件
  private popupScroll() {
    this.TriggeEvent('下拉列表滚动事件', null)
  }
  //搜索事件
  private onSearch(value: any) {
    this.TriggeEvent('搜索事件', null)
  }

  private deselect(value: any, option: any) {
    this.TriggeEvent('取消选中事件', null)
  }

  private inputKeydown() {
    this.TriggeEvent('键盘按下事件', null)
  }

  private mouseenter() {
    this.TriggeEvent('鼠标移入事件', null)
  }

  private mouseleave() {
    this.TriggeEvent('鼠标移出事件', null)
  }

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
    //window.console.info('----------------------------------------------------------param', Object.assign({}, param))
    // CurrentApis.simpleQueryView(param).then((res: any) => {
    //   //window.console.info('dictOptions', res)
    //   if (res && res.length > 0) {
    //     res.forEach((item) => {
    //       if (item.sys_dict_view__is_deleted === 0) {
    //         aray.push({
    //           item_name: item.sys_dict_view_item__item_name,
    //           item_value: item.sys_dict_view_item__item_value + '',
    //         })
    //       }
    //     })
    //     this.dictOptions = aray
    //     let prop = this.FindPropertyByName(PropertyGroupName.special, '数据源')
    //     if (prop) {
    //       this.SetPropertyVal(prop.id, aray)
    //     }
    //     window.console.info('-------------------------------------数据源xxxxxx', Object.assign(aray))
    //     this.TriggeEvent('控件加载完成事件', null)
    //   }
    // })

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
      let prop = this.FindPropertyByName(PropertyGroupName.special, '数据源')
      if (prop) {
        this.SetPropertyVal(prop.id, aray)
      }
      this.TriggeEvent('控件加载完成事件', null)
    }
  }

  /**需要绑定选中值 */
  public get validateProperty(): Property {
    var property = this.FindPropertyByName(PropertyGroupName.special, '当前选项值')
    return property
  }

  get vmodel(): any[] {
    this.showName = ''
    var property = this.FindPropertyByName(PropertyGroupName.special, '当前选项值')
    window.console.log('------------------------------propertyxxxx', property)
    let res = []
    if (property && (property.value != undefined && property.value != null && property.value != '')) {
      let len = 0
      if (property.value instanceof Array) {
        //res = property.value
        property.value.forEach((element) => {
          len++
          res.push(element.itemValue + '')
          if (len == property.value.length) {
            this.showName = this.showName + element.itemName
          } else {
            this.showName = this.showName + element.itemName + ',\n'
          }
        })
      } else {
        property.value.split(',').forEach((element) => {
          len++
          res.push(element)
          let item = this.dictOptions.find((option) => option.item_value == element)
          if (item) {
            if (len == property.value.split(',').length) {
              this.showName = this.showName + item.item_name
            } else {
              this.showName = this.showName + item.item_name + ',\n'
            }
          }
        })
      }
      //res = property.value
    }
    if (res && res.length > 0) {
      return res
    } else {
      return undefined
    }
  }
  set vmodel(val: any[]) {
    var property = this.FindPropertyByName(PropertyGroupName.special, '当前选项值')
    let currentValueStr = ''
    val.forEach((element) => {
      currentValueStr += element + ','
    })
    if (currentValueStr.length > 0) {
      currentValueStr = currentValueStr.substring(0, currentValueStr.length - 1)
    }
    this.SetPropertyVal(property.id, currentValueStr)
  }
  get options(): selectData {
    if (this.FindProperties(PropertyGroupName.special, '数据源')[0]) {
      return this.FindProperties(PropertyGroupName.special, '数据源')[0].value
    }
    return null
  }

  get isStem(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '是否内置')[0]) {
      return this.FindProperties(PropertyGroupName.special, '是否内置')[0].value as boolean
    }
    return false
  }

  //选择框的默认文字
  get placeholder(): string {
    if (this.FindPropertyByName(PropertyGroupName.special, '选择框默认文字')) {
      return this.FindPropertyByName(PropertyGroupName.special, '选择框默认文字').value as string
    }
    return '请选择'
  }
  //下拉列表为空时，显示的内容
  get notFoundContent(): string {
    if (this.FindPropertyByName(PropertyGroupName.special, '下拉列表为空默认显示内容')) {
      return this.FindPropertyByName(PropertyGroupName.special, '下拉列表为空默认显示内容').value as string
    }
    return '请添加选项'
  }
  //禁用属性
  // get disabled(): boolean {
  //   if (this.FindPropertyByName(PropertyGroupName.special, '是否禁用')) {
  //     return this.FindPropertyByName(PropertyGroupName.special, '是否禁用').value as boolean
  //   }
  // }
  //清空选择框属性
  get allowClear(): boolean {
    if (this.FindPropertyByName(PropertyGroupName.special, '是否允许清空选择框')) {
      return this.FindPropertyByName(PropertyGroupName.special, '是否允许清空选择框').value as boolean
    }
    return false
  }
  // @Watch('allowClear')
  // watchAllowClear() {
  //   if (this.allowClear) {
  //     this.FindPropertyByName(PropertyGroupName.special, '清空图标').canSetting = true
  //   } else {
  //     this.FindPropertyByName(PropertyGroupName.special, '清空图标').canSetting = false
  //   }
  // }

  //高亮第一个选项
  get defaultActiveFirstOption(): boolean {
    if (this.FindPropertyByName(PropertyGroupName.special, '是否默认高亮第一个选项')) {
      return this.FindPropertyByName(PropertyGroupName.special, '是否默认高亮第一个选项').value as boolean
    }
    return false
  }
  //大小属性
  get size(): string {
    if (this.FindProperties(PropertyGroupName.special, '尺寸')[0]) {
      return (this.FindProperties(PropertyGroupName.special, '尺寸')[0].value as string) == '大'
        ? 'large'
        : (this.FindProperties(PropertyGroupName.special, '尺寸')[0].value as string) == '中'
        ? 'default'
        : 'small'
    }
    return 'default'
  }

  //模式属性
  get mode(): string {
    // this.FindPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false
    // this.FindPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = true
    // this.FindPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').canSetting = false
    // this.FindPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = true
    return 'multiple'
  }

  //单选模式的搜索功能
  get showSearch(): boolean {
    if (this.FindPropertyByName(PropertyGroupName.special, '是否具备搜索功能')) {
      if (this.FindPropertyByName(PropertyGroupName.special, '是否具备搜索功能').value as boolean) {
        this.FindPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = true
      } else {
        this.FindPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = false
      }
      return this.FindPropertyByName(PropertyGroupName.special, '是否具备搜索功能').value as boolean
    }
    return false
  }

  get optionFilterProp(): string {
    if (this.FindPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索')) {
      return (this.FindPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').value as boolean) ? 'children' : 'value'
    }
    return 'children'
  }

  //tag模式的最大tag数量
  get maxTagCount(): number {
    if (this.FindPropertyByName(PropertyGroupName.special, '最多显示标签数(个)')) {
      return this.FindPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').value as number
    }
    return 1
  }

  get autoClearSearchValue(): boolean {
    if (this.FindPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框')) {
      return this.FindPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').value as boolean
    }
    return false
  }

  //字体大小
  get fontSize(): string {
    if (this.FindPropertyByName(PropertyGroupName.normal, '字体')) {
      return this.FindPropertyByName(PropertyGroupName.normal, '字体').value as string
    }
    return '14'
  }

  get fontColor(): string {
    if (this.FindPropertyByName(PropertyGroupName.normal, '前景色')) {
      return this.FindPropertyByName(PropertyGroupName.normal, '前景色').value as string
    }
    return '#000000'
  }
  //是否默认展开下拉菜单
  get defaultOpen(): boolean {
    if (this.FindPropertyByName(PropertyGroupName.special, '是否默认展开下拉菜单')) {
      return this.FindPropertyByName(PropertyGroupName.special, '是否默认展开下拉菜单').value as boolean
    }
    return false
  }
}
</script>
<style>
form .has-feedback > .ant-select .ant-select-arrow,
form .has-feedback > .ant-select .ant-select-selection__clear,
form .has-feedback :not(.ant-input-group-addon) > .ant-select .ant-select-arrow,
form .has-feedback :not(.ant-input-group-addon) > .ant-select .ant-select-selection__clear {
  right: 11px;
}
</style>