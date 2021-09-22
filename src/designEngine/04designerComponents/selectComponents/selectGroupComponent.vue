<template>
  <div>
    <a-select v-model="vmodel" :showSearch="showSearch" defaultValue="lucy" :style="{width: '100%',fontSize:fontSize+'px',color:fontColor,}"
      :disabled="disabled" :size="size" :mode="mode" :allowClear="allowClear" :placeholder="placeholder" :optionFilterProp="optionFilterProp"
      :defaultOpen="defaultOpen" :maxTagCount="maxTagCount" :notFoundContent="notFoundContent" :autoClearSearchValue="autoClearSearchValue"
      dropdownMatchSelectWidth @change="handleChange" @popupScroll="popupScroll" @search="onSearch" @select="onSelect" @deselect="deselect"
      @inputKeydown="inputKeydown" @mouseenter="mouseenter" @mouseleave="mouseleave" :getPopupContainer="triggerNode => triggerNode.parentNode">
      <a-icon slot="suffixIcon" :type="icon" />
      <a-icon slot="menuItemSelectedIcon" :type="selectedIcon" />
      <a-icon slot="removeIcon" :type="removeIcon" />
      <a-icon slot="clearIcon" :type="clearIcon" />
      <a-select-opt-group v-for="(group,indexG) in groupOptions" :key="indexG">
        <span slot="label">
          <!-- <a-icon :type="groupIcon" />-->{{group.label}}</span>
        <a-select-option v-for="(groupInfo,indexGI) in group.children" :value="groupInfo.value" :key="indexGI" :disabled="groupInfo.disabled">
          {{groupInfo.label}}</a-select-option>
      </a-select-opt-group>
    </a-select>
  </div>
</template>
<script lang="ts">
//labelInValue :maxTagTextLength="maxTagTextLength" :defaultActiveFirstOption="defaultActiveFirstOption"
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
enum propertyGroupOptionsEnum {
  groupOptions = '下拉列表数据源'
}
@Component
export default class SelectComponent extends ComponentBase {
  inparam: param[]
  outparam: param
  vmodel: any = 'lucy'
  // selectEleDisabled: boolean = false
  private get groupOptions(): any[] {
    return [
      {
        label: '北京',
        value: 'beijing',
        title: '北京 010',
        key: '100',
        children: [
          {
            label: '天安门',
            value: 'tiananmen',
            key: '110'
          },
          {
            label: '故宫',
            value: 'gugong',
            key: '120'
          }
        ]
      },
      {
        label: '上海',
        value: 'shanghai',
        key: '200',
        children: [
          {
            label: '东方明珠',
            value: 'dongfangmingzhu',
            key: '210'
          }
        ]
      },
      {
        label: '杭州',
        value: 'hangzhou',
        key: '300',
        disabled: true,
        children: [
          {
            label: '西湖',
            value: 'xihu',
            key: '310'
          }
        ]
      }
    ]
    //--------------李永乐注释，语法错误----
    // return this.getPropertyBindData(PropertyGroupName.normal, propertyGroupOptionsEnum.groupOptions)
  }

  mounted() {
    //this.registerProperty('是否禁用', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('是否默认展开下拉菜单', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('是否允许清空选择框', PropertyGroupName.special, new Boolean_Property(), true)
    // this.registerProperty('是否默认高亮第一个选项', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('选择框默认文字', PropertyGroupName.special, new Text_Property(), '请选择')
    this.registerProperty('下拉列表为空默认显示内容', PropertyGroupName.special, new Text_Property(), '请添加选项')
    this.registerProperty('设置组别图标', PropertyGroupName.special, new Enum_Property(true, ['根图标', '用户图标', '团队图标']), '团队图标')
    this.registerProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, ['大', '中', '小']), '中')
    this.registerProperty(
      '选择器模式',
      PropertyGroupName.special,
      new Enum_Property(true, ['单选模式', '多选模式', '标签模式', '组合框模式']),
      '单选模式'
    )
    this.registerProperty('是否具备搜索功能', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('是否按照菜单显示项搜索', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('是否在选中项后清空搜索框', PropertyGroupName.special, new Boolean_Property(), true)
    this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
    this.registerProperty('最多显示标签数(个)', PropertyGroupName.special, new Number_Property(), 5)
    this.findPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').canSetting = false
    // this.registerProperty('最大显示的tag文本长度', PropertyGroupName.special, new Number_Property(), 5)
    // this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false

    this.registerProperty('后缀图标', PropertyGroupName.special, new Enum_Property(true, ['微笑', '不悦', '上箭头', '下箭头']), '微笑')
    this.registerProperty('当前选中条目图标', PropertyGroupName.special, new Enum_Property(true, ['圆形对号', '方形对号', '对号']), '圆形对号')
    this.registerProperty('多选的清除图标', PropertyGroupName.special, new Enum_Property(true, ['圆形叉号', '方形叉号', '叉号']), '圆形叉号')
    this.registerProperty('清空图标', PropertyGroupName.special, new Enum_Property(true, ['圆形叉号', '方形叉号', '叉号']), '圆形叉号')
    this.findPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = false
    this.findPropertyByName(PropertyGroupName.special, '清空图标').canSetting = false
    this.findPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = false

    this.registerEvents('值改变事件', '', this.inparam, this.outparam)
    this.registerEvents('下拉列表滚动事件', '', this.inparam, this.outparam)
    this.registerEvents('搜索事件', '', this.inparam, this.outparam)
    this.registerEvents('被选中事件', '', this.inparam, this.outparam)
    this.registerEvents('取消选中事件', '', this.inparam, this.outparam)
    this.registerEvents('键盘按下事件', '', this.inparam, this.outparam)
    this.registerEvents('鼠标移入事件', '', this.inparam, this.outparam)
    this.registerEvents('鼠标移出事件', '', this.inparam, this.outparam)

    this.registerEvents('扩展选项事件', '', this.inparam, this.outparam)
    this.triggeEvent('扩展选项事件', null)

    this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false
    //--------------李永乐注释，语法错误----
    // this.$watch('selectInfos', this.watchSelectInfos, { deep: true })

    //属性改变
  }

  //事件
  private handleChange(value: any) {
    this.triggeEvent('值改变事件', null)
  }
  //下拉列表滚动事件
  private popupScroll() {
    this.triggeEvent('下拉列表滚动事件', null)
  }
  //搜索事件
  private onSearch(value: any) {
    this.triggeEvent('搜索事件', null)
  }
  //被选中是触发的事件
  private onSelect(value: any, option: any) {
    this.triggeEvent('被选中事件', null)
  }

  private deselect(value: any, option: any) {
    this.triggeEvent('取消选中事件', null)
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
  // get defaultActiveFirstOption(): boolean {
  //   if (this.findPropertyByName(PropertyGroupName.special, '是否默认高亮第一个选项')) {
  //     return this.findPropertyByName(PropertyGroupName.special, '是否默认高亮第一个选项').value as boolean
  //   }
  // }
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
    if (this.findProperties(PropertyGroupName.special, '尺寸')[0]) {
      return (this.findProperties(PropertyGroupName.special, '尺寸')[0].value as string) == '大'
        ? 'large'
        : (this.findProperties(PropertyGroupName.special, '尺寸')[0].value as string) == '中'
        ? 'default'
        : 'small'
    }
  }
  //模式属性
  get mode(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '选择器模式')) {
      if ((this.findPropertyByName(PropertyGroupName.special, '选择器模式').value as string) == '单选模式') {
        this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').canSetting = false
        // this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
        return 'default'
      } else if ((this.findPropertyByName(PropertyGroupName.special, '选择器模式').value as string) == '多选模式') {
        this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').canSetting = false
        // this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = true
        return 'multiple'
      } else if ((this.findPropertyByName(PropertyGroupName.special, '选择器模式').value as string) == '标签模式') {
        this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').canSetting = true
        // this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = true
        return 'tags'
      } else {
        this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = true
        this.findPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').canSetting = false
        // this.findPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false
        this.findPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
        return 'combobox'
      }
    }
    return 'default'
  }
  //单选模式的搜索功能
  get showSearch(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能')) {
      if (this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').value as boolean) {
        this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = true
      } else {
        this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').canSetting = false
      }
      return this.findPropertyByName(PropertyGroupName.special, '是否具备搜索功能').value as boolean
    }
  }

  get optionFilterProp(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索')) {
      return (this.findPropertyByName(PropertyGroupName.special, '是否按照菜单显示项搜索').value as boolean) ? 'children' : 'value'
    }
    return 'children'
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
    if (this.findPropertyByName(PropertyGroupName.special, '最多显示标签数(个)')) {
      return this.findPropertyByName(PropertyGroupName.special, '最多显示标签数(个)').value as number
    }
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
  }
}
</script>