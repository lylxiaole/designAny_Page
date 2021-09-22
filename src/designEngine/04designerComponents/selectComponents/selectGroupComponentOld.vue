<template>
  <div>
    <a-select :showSearch="showSearch" defaultValue="lucy" style="width: 120px" :disabled="disabled" :size="size" :mode="mode"
      :allowClear="allowClear" :placeholder="placeholder" :defaultActiveFirstOption="defaultActiveFirstOption" :maxTagCount="maxTagCount"
      :maxTagTextLength="maxTagTextLength" :notFoundContent="notFoundContent" :autoClearSearchValue="autoClearSearchValue" dropdownMatchSelectWidth
      @change="handleChange" @popupScroll="popupScroll" @search="onSearch">
      <a-icon slot="suffixIcon" :type="icon" />
      <a-icon slot="menuItemSelectedIcon" :type="selectedIcon" />
      <a-icon slot="removeIcon" :type="removeIcon" />
      <a-icon slot="clearIcon" :type="clearIcon" />
      <!-- <a-select-option v-for="(info,index) in selectInfos" :value="info.selectEleName" :disabled="info.selectEleDisabled" :key="index">
        {{info.selectEleName}}</a-select-option> -->
      <a-select-opt-group v-for="(group,indexG) in selectInfos" :key="indexG">
        <span slot="label">
          <a-icon :type="groupIcon" />{{group.selectGroupName}}</span>
        <a-select-option v-for="(groupInfo,indexGI) in group.selectGroupEleInfo" :value="groupInfo.name" :key="indexGI"
          :disabled="groupInfo.disabled">
          {{groupInfo.name}}</a-select-option>
      </a-select-opt-group>
    </a-select>
  </div>
</template>
<script lang="ts">
//labelInValue
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
  SelectGroup_Property
} from '../../03designerLayoutBase'
import { ComponentBase } from '../../03designerLayoutBase'
import { param, paramType } from '../../03designerLayoutBase'
import selectElementInfo from '../../02common/commonClasses/selectElementInfo'
@Component
export default class SelectComponent extends ComponentBase {
  inparam: param[]
  outparam: param

  selectEleDisabled: boolean = false

  mounted() {
    //this.registerProperty('是否禁用', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('是否允许清空选择框', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('是否默认高亮第一个选项', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('选择框默认文字', PropertyGroupName.special, new Text_Property(), '请选择')
    this.registerProperty('下拉列表为空默认显示内容', PropertyGroupName.special, new Text_Property(), '请添加选项')
    this.registerProperty('设置组别图标', PropertyGroupName.special, new Enum_Property(true, ['根图标', '用户图标', '团队图标']), '团队图标')
    this.registerProperty('选择器大小', PropertyGroupName.special, new Enum_Property(true, ['大', '中', '小']), '中')
    this.registerProperty(
      '选择器模式',
      PropertyGroupName.special,
      new Enum_Property(true, ['单选模式', '多选模式', '标签模式', '组合框模式']),
      '单选模式'
    )
    this.registerProperty('是否在选中项后清空搜索框', PropertyGroupName.special, new Boolean_Property(), true)
    this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
    this.registerProperty('最多显示tag数', PropertyGroupName.special, new Number_Property(), 5)
    this.findPropertyByName(PropertyGroupName.special, '最多显示tag数').canSetting = false
    this.registerProperty('最大显示的tag文本长度', PropertyGroupName.special, new Number_Property(), 5)
    this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false
    this.registerProperty('是否具备搜索功能', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('后缀图标', PropertyGroupName.special, new Enum_Property(true, ['微笑', '不悦', '上箭头', '下箭头']), '微笑')
    this.registerProperty('当前选中条目图标', PropertyGroupName.special, new Enum_Property(true, ['圆形对号', '方形对号', '对号']), '圆形对号')
    this.registerProperty('多选的清除图标', PropertyGroupName.special, new Enum_Property(true, ['圆形叉号', '方形叉号', '叉号']), '圆形叉号')
    this.registerProperty('清空图标', PropertyGroupName.special, new Enum_Property(true, ['圆形叉号', '方形叉号', '叉号']), '圆形叉号')
    this.findPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = false
    this.findPropertyByName(PropertyGroupName.special, '清空图标').canSetting = false
    this.findPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = false

    this.registerProperty('设置属性', PropertyGroupName.special, new SelectGroup_Property())

    this.registerEvents('改变事件', '', this.inparam, this.outparam)
    this.registerEvents('下拉列表滚动事件', '', this.inparam, this.outparam)
    this.registerEvents('远程搜索事件', '', this.inparam, this.outparam)

    this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false

    this.$watch('selectInfos', this.watchSelectInfos, { deep: true })
  }
  //事件
  private handleChange(value: any) {
    this.triggeEvent('改变事件', null)
  }
  //下拉列表滚动事件
  private popupScroll() {
    this.triggeEvent('下拉列表滚动事件', null)
  }
  //远程搜索事件
  private onSearch() {
    this.triggeEvent('远程搜索事件', null)
  }
  watchSelectInfos() {}
  get selectInfos(): selectElementInfo[] {
    var val
    if (this.findProperties(PropertyGroupName.special, '设置属性')[0]) {
      val = this.findProperties(PropertyGroupName.special, '设置属性')[0].value
    }
    if (!val) {
      return
    }
    let info: selectElementInfo[] = []
    let groupInfoNew: selectElementInfo[] = []
    info = [...val]
    let length = info.length
    while (length > 0) {
      groupInfoNew.push(info[0])
      groupInfoNew[groupInfoNew.length - 1].selectGroupEleInfo = []
      groupInfoNew[groupInfoNew.length - 1].selectGroupEleInfo.push({
        name: info[0].selectEleName,
        disabled: info[0].selectEleDisabled
      })
      info.splice(0, 1)
      length = info.length
      for (let j = 0; j < length; j++) {
        if (groupInfoNew[groupInfoNew.length - 1].selectGroupName == info[j].selectGroupName) {
          groupInfoNew[groupInfoNew.length - 1].selectGroupEleInfo.push({
            name: info[j].selectEleName,
            disabled: info[j].selectEleDisabled
          })
          info.splice(j, 1)
          length = info.length
          j--
        }
      }
    }
    return groupInfoNew as selectElementInfo[]
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
  }
  @Watch('allowClear')
  watchAllowClear() {
    if (this.allowClear) {
      this.findPropertyByName(PropertyGroupName.special, '清空图标').canSetting = true
    } else {
      this.findPropertyByName(PropertyGroupName.special, '清空图标').canSetting = false
    }
  }
  //高亮第一个选项
  get defaultActiveFirstOption(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否默认高亮第一个选项')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否默认高亮第一个选项').value as boolean
    }
  }
  //设置组别图标
  get groupIcon(): string {
    if (this.findProperties(PropertyGroupName.special, '设置组别图标')[0]) {
      if ((this.findProperties(PropertyGroupName.special, '设置组别图标')[0].value as string) == '用户图标') {
        return 'user'
      } else if ((this.findProperties(PropertyGroupName.special, '设置组别图标')[0].value as string) == '团队图标') {
        return 'team'
      } else {
        return 'home'
      }
    }
  }

  //大小属性
  get size(): string {
    if (this.findProperties(PropertyGroupName.special, '选择器大小')[0]) {
      return (this.findProperties(PropertyGroupName.special, '选择器大小')[0].value as string) == '大'
        ? 'large'
        : (this.findProperties(PropertyGroupName.special, '选择器大小')[0].value as string) == '中'
        ? 'default'
        : 'small'
    }
  }
  //模式属性
  get mode(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '选择器模式')) {
      if ((this.findPropertyByName(PropertyGroupName.special, '选择器模式').value as string) == '单选模式') {
        this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '最多显示tag数').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
        return 'default'
      } else if ((this.findPropertyByName(PropertyGroupName.special, '选择器模式').value as string) == '多选模式') {
        this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '最多显示tag数').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = true
        return 'multiple'
      } else if ((this.findPropertyByName(PropertyGroupName.special, '选择器模式').value as string) == '标签模式') {
        this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '最多显示tag数').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = true
        return 'tags'
      } else {
        this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '最多显示tag数').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
        return 'combobox'
      }
    }
    return 'default'
  }
  //单选模式的搜索功能
  get showSearch(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').value as boolean
    }
  }
  //单选模式的后缀图标
  get icon(): string {
    if (this.findProperties(PropertyGroupName.special, '后缀图标')[0]) {
      if ((this.findProperties(PropertyGroupName.special, '后缀图标')[0].value as string) == '微笑') {
        return 'smile'
      } else if ((this.findPropertyByName(PropertyGroupName.special, '后缀图标').value as string) == '不悦') {
        return 'frown'
      } else if ((this.findPropertyByName(PropertyGroupName.special, '后缀图标').value as string) == '上箭头') {
        return 'up-circle'
      } else {
        return 'down-circle'
      }
    }
    return ''
  }

  //多选模式的当前选中图标
  get selectedIcon(): string {
    if (this.findProperties(PropertyGroupName.special, '当前选中条目图标')[0]) {
      if ((this.findProperties(PropertyGroupName.special, '当前选中条目图标')[0].value as string) == '圆形对号') {
        return 'check-circle'
      } else if ((this.findProperties(PropertyGroupName.special, '当前选中条目图标')[0].value as string) == '方形对号') {
        return 'check-square'
      } else {
        return 'check'
      }
    }
  }
  //多选模式的清除图标
  get removeIcon(): string {
    if (this.findProperties(PropertyGroupName.special, '多选的清除图标')[0]) {
      if ((this.findProperties(PropertyGroupName.special, '多选的清除图标')[0].value as string) == '圆形叉号') {
        return 'close-circle'
      } else if ((this.findProperties(PropertyGroupName.special, '多选的清除图标')[0].value as string) == '方形叉号') {
        return 'close-square'
      } else {
        return 'close'
      }
    }
  }

  //多选模式的清空图标
  get clearIcon(): string {
    if (this.findProperties(PropertyGroupName.special, '清空图标')[0]) {
      if ((this.findProperties(PropertyGroupName.special, '清空图标')[0].value as string) == '圆形叉号') {
        return 'close-circle'
      } else if ((this.findProperties(PropertyGroupName.special, '清空图标')[0].value as string) == '方形叉号') {
        return 'close-square'
      } else {
        return 'close'
      }
    }
  }

  //tag模式的最大tag数量
  get maxTagCount(): number {
    if (this.findPropertyByName(PropertyGroupName.special, '最多显示tag数')) {
      return this.findPropertyByName(PropertyGroupName.special, '最多显示tag数').value as number
    }
  }
  //最大显示的tag文本长度
  get maxTagTextLength(): number {
    if (this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度')) {
      return this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').value as number
    }
  }
  //是否在选中项后清空搜索框,只在mode是tag或multipe模式下有效
  get autoClearSearchValue(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').value as boolean
    }
  }
}
</script>