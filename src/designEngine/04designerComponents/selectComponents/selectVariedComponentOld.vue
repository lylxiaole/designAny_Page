<template>
  <div>
    <a-select v-model="vmodel" :showSearch="showSearch" :style="{width: '100%',fontSize:fontSize+'px',color:fontColor,}" :disabled="disabled"
      :size="size" :mode="mode" :tokenSeparators="[',']" :placeholder="placeholder" :allowClear="allowClear"
      :defaultActiveFirstOption="defaultActiveFirstOption" :maxTagCount="maxTagCount" :defaultOpen="defaultOpen" :notFoundContent="notFoundContent"
      :autoClearSearchValue="autoClearSearchValue" dropdownMatchSelectWidth @change="handleChange" @popupScroll="popupScroll" @search="onSearch"
      @select="onSelect" @deselect="deselect" @inputKeydown="inputKeydown" @mouseenter="mouseenter" @mouseleave="mouseleave">
      <a-icon slot="suffixIcon" :type="icon" />
      <a-icon slot="menuItemSelectedIcon" :type="selectedIcon" />
      <a-icon slot="removeIcon" :type="removeIcon" />
      <a-icon slot="clearIcon" :type="clearIcon" />
      <a-icon slot="menuItemSelectedIcon" type="user" />
      <!-- <a-select-opt-group v-for="(info,index) in dataSource" :key="index"> -->
      <a-select-option v-for="(info,index) in dataSource" :key="index" :value="info.value" :disabled="info.disabled">
        <a-icon v-if="info.children.length==0" :type="info.icon" style="margin-right:5px"></a-icon>{{info.label}}
      </a-select-option>
      <a-select-opt-group v-for="(info,index) in dataSource" :key="index">
        <span slot="label">
          <a-icon :type="info.icon" style="margin-right:5px"></a-icon>{{info.label}}
        </span>
        <a-select-option v-for="(ginfo,gindex) in info.children" :key="gindex" :value="ginfo.value" :disabled="ginfo.disabled">
          {{ginfo.label}}
        </a-select-option>
      </a-select-opt-group>
      <!-- <a-select-option v-for="(info,index) in dataSource" :key="index">
        <span slot="label">
          <a-icon :type="info.icon"></a-icon>{{info.name}}
        </span>
        <div slot="dropdownRender" v-if="info.children.length>0">
          <template>
            <a-select-option v-for="(ginfo,gindex) in info.children" :key="gindex" :value="ginfo.name" :disabled="ginfo.disabled">
              <a-icon :type="ginfo.icon"></a-icon>{{ginfo.name}}

            </a-select-option>
          </template>
        </div>
      </a-select-option> -->
      <!-- </a-select-opt-group> -->

      <!-- <a-select-opt-group v-for="(info,index) in dataSource" v-if="info.children.length>0" :key="index">
        <a-select-option v-for="(ginfo,gindex) in info.children" :key="gindex" :value="ginfo.value" :disabled="ginfo.disabled">
          {{ginfo.label}}
        </a-select-option>
      </a-select-opt-group> -->
    </a-select>
  </div>
</template>
 <script lang="ts">
// :maxTagTextLength="maxTagTextLength" labelInValue optionFilterProp="children" :filterOption="filterOption"
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
} from '../../02common/commonClasses/LayoutProperty'
import ComponentBase from '../ComponentBase'
import { param, paramType } from '../../02common/commonClasses/layoutEvent'
import selectElementInfo from '../../02common/commonClasses/selectElementInfo'

enum propertyDatasourceEnum {
  datasource = '下拉列表数据源',
}

@Component
export default class SelectComponentNew extends ComponentBase {
  inparam: param[]
  outparam: param
  vmodel: any = 'lucy'
  selectEleDisabled: boolean = false
  private get dataSource(): any[] {
    return [
      {
        label: '北京',
        value: 'beijing',
        title: '北京 010',
        key: '10000',
        icon: 'team',
        children: [
          {
            label: '天安门',
            value: 'tiananmen',
            key: '11000',
            icon: 'user',
          },
          {
            label: '故宫',
            value: 'gugong',
            key: '12000',
            icon: 'user',
          },
        ],
      },
      {
        label: '上海',
        value: 'shanghai',
        key: '10000',
        icon: 'smile',
        children: [],
      },
      {
        label: '杭州',
        value: 'hangzhou',
        key: '10000',
        disabled: false,
        icon: 'smile',
        children: [],
      },
    ]
    // return this.getPropertyBindData(PropertyGroupName.normal, propertyDatasourceEnum.datasource) as any[]
  }

  mounted() {
    //注册属性
    //this.RegisterProperty('是否禁用', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('是否默认展开下拉菜单', PropertyGroupName.special, new Boolean_Property(), true)
    this.RegisterProperty('是否允许清空选择框', PropertyGroupName.special, new Boolean_Property(), true)
    this.RegisterProperty('是否默认高亮第一个选项', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('选择框默认文字', PropertyGroupName.special, new Text_Property(), '请选择')
    this.RegisterProperty('下拉列表为空默认显示内容', PropertyGroupName.special, new Text_Property(), '请添加选项')
    this.RegisterProperty('选择器大小', PropertyGroupName.special, new Enum_Property(true, ['大', '中', '小']), '中')
    this.RegisterProperty(
      '选择器模式',
      PropertyGroupName.special,
      new Enum_Property(true, ['单选模式', '多选模式', '标签模式', '组合框模式']),
      '单选模式'
    )
    this.RegisterProperty('是否在选中项后清空搜索框', PropertyGroupName.special, new Boolean_Property(), true)
    this.FindPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
    this.RegisterProperty('最多显示tag数(个)', PropertyGroupName.special, new Number_Property(), 5)
    this.FindPropertyByName(PropertyGroupName.special, '最多显示tag数(个)').canSetting = false
    // this.RegisterProperty('最大显示的tag文本长度', PropertyGroupName.special, new Number_Property(), 5)
    // this.FindPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false
    this.RegisterProperty('是否具备搜索功能', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('后缀图标', PropertyGroupName.special, new Enum_Property(true, ['微笑', '不悦', '上箭头', '下箭头']), '微笑')
    this.RegisterProperty('当前选中条目图标', PropertyGroupName.special, new Enum_Property(true, ['圆形对号', '方形对号', '对号']), '圆形对号')
    this.RegisterProperty('多选的清除图标', PropertyGroupName.special, new Enum_Property(true, ['圆形叉号', '方形叉号', '叉号']), '圆形叉号')
    this.RegisterProperty('清空图标', PropertyGroupName.special, new Enum_Property(true, ['圆形叉号', '方形叉号', '叉号']), '圆形叉号')
    this.FindPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = false
    this.FindPropertyByName(PropertyGroupName.special, '清空图标').canSetting = false
    this.FindPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = false
    // this.RegisterProperty('设置属性', PropertyGroupName.special, new Select_Property())
    //注册事件
    this.RegisterEvents('改变事件', '', this.inparam, this.outparam)
    this.RegisterEvents('下拉列表滚动事件', '', this.inparam, this.outparam)
    this.RegisterEvents('远程搜索事件', '', this.inparam, this.outparam)
    this.RegisterEvents('被选中事件', '', this.inparam, this.outparam)
    this.RegisterEvents('取消选中事件', '', this.inparam, this.outparam)
    this.RegisterEvents('键盘按下事件', '', this.inparam, this.outparam)
    this.RegisterEvents('鼠标移入事件', '', this.inparam, this.outparam)
    this.RegisterEvents('鼠标移出事件', '', this.inparam, this.outparam)

    this.RegisterEvents('扩展选项事件', '', this.inparam, this.outparam)
    this.TriggeEvent('扩展选项事件', null)
    //添加监听
    //this.$watch('selectInfos', this.watchSelectInfos, { deep: true })
  }

  //事件
  private handleChange(value: any) {
    this.TriggeEvent('改变事件', null)
  }
  //下拉列表滚动事件
  private popupScroll() {
    this.TriggeEvent('下拉列表滚动事件', null)
  }
  //远程搜索事件
  private onSearch() {
    this.TriggeEvent('远程搜索事件', null)
  }
  //被选中是触发的事件
  private onSelect(value: any, option: any) {
    this.TriggeEvent('被选中事件', null)
  }

  private deselect() {
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
  // filterOption(input: any, option: any) {
  //   console.log(option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
  //   return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  // }
  // get selectInfos(): selectElementInfo[] {
  //   var val
  //   if (this.FindProperties(PropertyGroupName.special, '设置属性')[0]) {
  //     val = this.FindProperties(PropertyGroupName.special, '设置属性')[0].value
  //   }
  //   if (!val) {
  //     return
  //   }
  //   return val as selectElementInfo[]
  // }
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
  }
  @Watch('allowClear')
  watchAllowClear() {
    if (this.allowClear) {
      this.FindPropertyByName(PropertyGroupName.special, '清空图标').canSetting = true
    } else {
      this.FindPropertyByName(PropertyGroupName.special, '清空图标').canSetting = false
    }
  }
  //高亮第一个选项
  get defaultActiveFirstOption(): boolean {
    if (this.FindPropertyByName(PropertyGroupName.special, '是否默认高亮第一个选项')) {
      return this.FindPropertyByName(PropertyGroupName.special, '是否默认高亮第一个选项').value as boolean
    }
  }
  //大小属性
  get size(): string {
    if (this.FindProperties(PropertyGroupName.special, '选择器大小')[0]) {
      return (this.FindProperties(PropertyGroupName.special, '选择器大小')[0].value as string) == '大'
        ? 'large'
        : (this.FindProperties(PropertyGroupName.special, '选择器大小')[0].value as string) == '中'
        ? 'default'
        : 'small'
    }
  }
  //模式属性
  get mode(): string {
    if (this.FindPropertyByName(PropertyGroupName.special, '选择器模式')) {
      if ((this.FindPropertyByName(PropertyGroupName.special, '选择器模式').value as string) == '单选模式') {
        this.FindPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = true
        this.FindPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = true
        this.FindPropertyByName(PropertyGroupName.special, '最多显示tag数(个)').canSetting = false
        // this.FindPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
        return 'default'
      } else if ((this.FindPropertyByName(PropertyGroupName.special, '选择器模式').value as string) == '多选模式') {
        this.FindPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = true
        this.FindPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = true
        this.FindPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '最多显示tag数(个)').canSetting = false
        // this.FindPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = true
        return 'multiple'
      } else if ((this.FindPropertyByName(PropertyGroupName.special, '选择器模式').value as string) == '标签模式') {
        this.FindPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = true
        this.FindPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = true
        this.FindPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '最多显示tag数(个)').canSetting = true
        // this.FindPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = true
        this.FindPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = true
        return 'tags'
      } else {
        this.FindPropertyByName(PropertyGroupName.special, '是否具备搜索功能').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '当前选中条目图标').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '多选的清除图标').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '后缀图标').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '最多显示tag数(个)').canSetting = false
        // this.FindPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').canSetting = false
        this.FindPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').canSetting = false
        return 'combobox'
      }
    }
    return 'default'
  }
  //单选模式的搜索功能
  get showSearch(): boolean {
    if (this.FindPropertyByName(PropertyGroupName.special, '是否具备搜索功能')) {
      return this.FindPropertyByName(PropertyGroupName.special, '是否具备搜索功能').value as boolean
    }
  }
  //单选模式的后缀图标
  get icon(): string {
    if (this.FindProperties(PropertyGroupName.special, '后缀图标')[0]) {
      if ((this.FindProperties(PropertyGroupName.special, '后缀图标')[0].value as string) == '微笑') {
        return 'smile'
      } else if ((this.FindPropertyByName(PropertyGroupName.special, '后缀图标').value as string) == '不悦') {
        return 'frown'
      } else if ((this.FindPropertyByName(PropertyGroupName.special, '后缀图标').value as string) == '上箭头') {
        return 'up-circle'
      } else {
        return 'down-circle'
      }
    }
    return ''
  }
  //多选模式的当前选中图标
  get selectedIcon(): string {
    if (this.FindProperties(PropertyGroupName.special, '当前选中条目图标')[0]) {
      if ((this.FindProperties(PropertyGroupName.special, '当前选中条目图标')[0].value as string) == '圆形对号') {
        return 'check-circle'
      } else if ((this.FindProperties(PropertyGroupName.special, '当前选中条目图标')[0].value as string) == '方形对号') {
        return 'check-square'
      } else {
        return 'check'
      }
    }
  }
  //多选模式的清除图标
  get removeIcon(): string {
    if (this.FindProperties(PropertyGroupName.special, '多选的清除图标')[0]) {
      if ((this.FindProperties(PropertyGroupName.special, '多选的清除图标')[0].value as string) == '圆形叉号') {
        return 'close-circle'
      } else if ((this.FindProperties(PropertyGroupName.special, '多选的清除图标')[0].value as string) == '方形叉号') {
        return 'close-square'
      } else {
        return 'close'
      }
    }
  }
  //多选模式的清空图标
  get clearIcon(): string {
    if (this.FindProperties(PropertyGroupName.special, '清空图标')[0]) {
      if ((this.FindProperties(PropertyGroupName.special, '清空图标')[0].value as string) == '圆形叉号') {
        return 'close-circle'
      } else if ((this.FindProperties(PropertyGroupName.special, '清空图标')[0].value as string) == '方形叉号') {
        return 'close-square'
      } else {
        return 'close'
      }
    }
  }
  //tag模式的最大tag数量
  get maxTagCount(): number {
    if (this.FindPropertyByName(PropertyGroupName.special, '最多显示tag数(个)')) {
      return this.FindPropertyByName(PropertyGroupName.special, '最多显示tag数(个)').value as number
    }
  }
  //最大显示的tag文本长度
  // get maxTagTextLength(): number {
  //   if (this.FindPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度')) {
  //     return this.FindPropertyByName(PropertyGroupName.special, '最大显示的tag文本长度').value as number
  //   }
  // }
  //是否在选中项后清空搜索框,只在mode是tag或multipe模式下有效
  get autoClearSearchValue(): boolean {
    if (this.FindPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框')) {
      return this.FindPropertyByName(PropertyGroupName.special, '是否在选中项后清空搜索框').value as boolean
    }
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
  }
}
</script>