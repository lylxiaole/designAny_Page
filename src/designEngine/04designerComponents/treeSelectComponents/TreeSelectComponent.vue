<template>
  <a-tree-select :style="{width: '100%'}" :treeData="treeData" :disabled="disabled" :showSearch="showSearch" :treeCheckable="treeCheckable"
    :dropdownMatchSelectWidth="true" :size="size" treeNodeFilterProp="title" @change="selectchange" @search="searchData" @treeExpand="expandTree"
    v-model="vmodel" placeholder="请选择" :allowClear="allowClear">
  </a-tree-select>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'

import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  Boolean_Property,
  Number_Property,
  Color_Property,
  BindingModels_Property
} from '../../03designerLayoutBase'

import { ComponentBase } from '../../03designerLayoutBase'

import { CurrentApis, CurrentContext } from '../../01designerContext'
import { param, paramType } from '../../03designerLayoutBase'
import common from '../../02common/commonMethod'

export interface TreeNodeInfo {
  label?: string
  title?: string
  key: string
  isLeaf?: boolean
  disabled?: boolean
  disableCheckbox?: boolean
  selectable?: boolean
  children?: TreeNodeInfo[]
}

@Component
export default class TreeSelectComponent extends ComponentBase {
  //selectvalue: string

  get selectvalues(): string[] {
    if (this.findPropertyByName(PropertyGroupName.special, '选中值列表')) {
      return this.findPropertyByName(PropertyGroupName.special, '选中值列表').value
    } else {
      return []
    }
  }

  @Prop()
  value: string

  @Watch('value')
  valueChange() {
    //window.console.log('------------------触发选择框变更了')
    this.vmodel = this.value
  }

  get vmodel(): any {
    var property = this.findPropertyByName(PropertyGroupName.special, '选中值')
    // if (property && property.value != undefined && property.value.itemValue !== undefined) {
    //   this.setPropertyVal(property.id, property.value.itemValue)
    // }
    //window.console.log('------------------------------获取当前选项值property', property)
    let aaa = property ? (property.value != undefined && property.value != null && property.value != '' ? property.value + '' : undefined) : undefined
    //window.console.log('------------------------------获取当前选项值aaa', aaa)
    return aaa
  }
  set vmodel(val: any) {
    //window.console.log('------------------------------设置选中', val)
    var property = this.findPropertyByName(PropertyGroupName.special, '选中值')
    this.setPropertyVal(property.id, val)
  }

  inparam: param[]
  outparam: param
  nodeList: TreeNodeInfo[]
  selectNode: TreeNodeInfo

  // get disabled(): boolean {
  //   if (this.findPropertyByName(PropertyGroupName.special, '是否可用')) {
  //     return this.findPropertyByName(PropertyGroupName.special, '是否可用').value as boolean
  //   } else {
  //     return false
  //   }
  // }

  get showSearch(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否显示搜索框')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否显示搜索框').value as boolean
    } else {
      return false
    }
  }

  get treeCheckable(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否允许多选')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否允许多选').value as boolean
    } else {
      return false
    }
  }

  get size(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '尺寸')) {
      let newval = this.findPropertyByName(PropertyGroupName.special, '尺寸').value
      return newval === '大' ? 'large' : newval === '小' ? 'small' : 'default'
    } else {
      return 'default'
    }
  }

  get allowClear(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否允许清空选择框')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否允许清空选择框').value as boolean
    }
    return false
  }

  //选中顶层节点触发，更改选中值和选中的列表值
  selectchange(value: any, node: any, extra: any) {
    //this.findPropertyByName(PropertyGroupName.special, '选中值列表').value = value
    //window.console.log('选中树---------------', value)
    //window.console.log('选中树---------------', node)
    //window.console.log('选中树---------------', extra.triggerNode.dataRef.tag)
    //window.console.log('---------------选中树的值', value)
    var prop = this.findPropertyByName(PropertyGroupName.special, '选中值')
    if (prop && extra.triggerNode.dataRef.tag) {
      this.setPropertyVal(prop.id, value)
    }
    this.selectNode = common.clone(extra.triggerNode.dataRef)
    //window.console.log('-------------xxxxyyyyyy获取选中节点全部信息', this.selectNode)
    this.triggeEvent('值改变事件', null)
  }

  //树节点展开事件
  expandTree(expandedKeys: any) {
    //window.console.log('展开', expandedKeys)
    this.triggeEvent('节点展开事件', expandedKeys)
  }

  //模糊查询数据
  searchData(value: any) {
    let param = []
    this.triggeEvent('模糊查询事件', value)
  }

  pm: paramType

  mounted() {
    this.width = 200
    //this.height = 30
    //this.disabled = false
    //是否可用
    //this.registerProperty('是否可用', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('选中值', PropertyGroupName.special, new BindingModels_Property(), null, true, true)
    this.registerProperty('数据源', PropertyGroupName.special, new BindingModels_Property(), [], true, true)
    //是否允许多选
    this.registerProperty('是否允许多选', PropertyGroupName.special, new Boolean_Property(), false, false)
    //是否显示搜索框
    this.registerProperty('是否显示搜索框', PropertyGroupName.special, new Boolean_Property(), false)
    //尺寸
    this.registerProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, ['大', '中', '小']), '中')
    //this.registerEvents('节点展开事件', '', this.inparam, this.outparam)
    //this.registerEvents('节点展开事件', '', this.inparam, this.outparam)
    //this.registerEvents('模糊查询事件', '', this.inparam, this.outparam)

    this.registerEvents('值改变事件', '', this.inparam, this.outparam)
    this.registerMethods('获取选中项关联id', '', this.getSelectKeys, this.inparam, null)

    this.registerProperty('是否允许清空选择框', PropertyGroupName.special, new Boolean_Property(), true)
    /**注册组件事件 */
    this.$on('onPropertyChanged', this.onComponentPropertyChanged)
  }

  public get validateProperty(): Property {
    var property = this.findPropertyByName(PropertyGroupName.special, '选中值')
    return property
  }

  loadData(node: any): TreeNodeInfo[] {
    //return nodeList
    //window.console.log('node', node)
    var datas = CurrentApis.GetTreeSelectData()
    datas.forEach((element) => {
      //只能选择最底层菜单
      if (element.children) {
        element.disabled = true
      }
    })
    this.findPropertyByName(PropertyGroupName.special, '数据源').value = datas
    return datas
  }

  refreshData(nodeList: TreeNodeInfo[]): TreeNodeInfo[] {
    this.findPropertyByName(PropertyGroupName.special, '数据源').value = nodeList
    return nodeList
  }

  //获取树形的数据源
  get treeData(): TreeNodeInfo[] {
    let temp = this.findPropertyByName(PropertyGroupName.special, '数据源')
    if (temp && temp.value instanceof Array) {
      temp.value.forEach((item) => {
        //item.value = item.key
        this.recursion(item)
      })
      return temp.value
    } else {
      return []
    }
    //return datas
  }

  /** 递归来更新数据，需要一个value */
  recursion(item) {
    if (item.children != undefined && item.children.length > 0) {
      item.children.forEach((single) => {
        single.value = single.key
        if (single.children != undefined && single.children.length > 0) {
          this.recursion(single)
        }
      })
    }
    item.value = item.key
    return
  }

  // @Emit('onPropertyChanged')
  onComponentPropertyChanged(id: string, property: Property, layout: ComponentBase): void {}

  selectAllKeys: any[]
  /**
   * 获取关联id
   */
  getSelectKeys(param: any) {
    //window.console.log('-------------xxxx获取选中节点全部信息', this.selectNode)
    this.selectAllKeys = []
    this.getKeyRecursion(this.selectNode)
    return this.selectAllKeys
  }

  getKeyRecursion(item) {
    if (this.selectAllKeys.findIndex((element) => element == item.key) < 0) {
      this.selectAllKeys.push(item.key)
    }
    if (item.children != undefined && item.children.length > 0) {
      item.children.forEach((single) => {
        if (this.selectAllKeys.findIndex((element) => element == single.key) < 0) {
          this.selectAllKeys.push(single.key)
        }
        if (single.children != undefined && single.children.length > 0) {
          this.getKeyRecursion(single)
        }
      })
    }
    return
  }
}
</script>


<style lang="less">
.testClass {
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  margin: 0;
  list-style: none;
  display: inline-block;
  position: relative;
  outline: 0;
}

.testClass-disabled {
  color: rgba(0, 0, 0, 0.25);
}

.testClass-disabled .testClass-selection {
  background: #f5f5f5;
  cursor: not-allowed;
}

.testClass-selection--single {
  height: 32px;
  position: relative;
  cursor: pointer;
}
.testClass-selection {
  outline: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  box-sizing: border-box;
  display: block;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  border-top-width: 1.02px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.testClass-selection__rendered {
  display: block;
  margin-left: 11px;
  margin-right: 11px;
  position: relative;
  line-height: 30px;
}
.testClass-selection-selected-value {
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  padding-right: 20px;
  //color: red;
}
.testClass-selection__clear {
  display: inline-block;
  font-style: normal;
  vertical-align: baseline;
  text-align: center;
  text-transform: none;
  text-rendering: auto;
  opacity: 0;
  position: absolute;
  right: 11px;
  z-index: 1;
  background: #fff;
  top: 50%;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.25);
  width: 12px;
  height: 12px;
  margin-top: -6px;
  line-height: 12px;
  cursor: pointer;
  transition: color 0.3s ease, opacity 0.15s ease;
}
.testClass-arrow {
  display: inline-block;
  font-style: normal;
  vertical-align: -0.125em;
  text-align: center;
  text-transform: none;
  line-height: 0;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: absolute;
  top: 50%;
  right: 11px;
  line-height: 1;
  margin-top: -6px;
  transform-origin: 50% 50%;
  color: rgba(0, 0, 0, 0.25);
  font-size: 12px;
}
.testClass-arrow .testClass-arrow-icon {
  display: block;
}

// .testClass-open {
// }

// .testClass-focused {
// }

.testClass-selection__placeholder,
.testClass-search__field__placeholder {
  position: absolute;
  top: 50%;
  left: 0;
  right: 9px;
  color: #bfbfbf;
  line-height: 20px;
  height: 20px;
  max-width: 100%;
  margin-top: -10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

// 下拉框样式
.testClass-dropdown {
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  margin: 0;
  padding: 0;
  list-style: none;
  font-variant: initial;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  box-sizing: border-box;
  z-index: 1050;
  left: -9999px;
  top: -9999px;
  position: absolute;
  outline: none;
  font-size: 14px;
}

.testClass-tree-dropdown {
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
}

.testClass-tree-dropdown .testClass-dropdown-search {
  display: block;
  padding: 4px;
}

.testClass-tree-dropdown .testClass-dropdown-search .testClass-search__field__wrap {
  width: 100%;
}

.testClass-search__field__wrap {
  display: inline-block;
  position: relative;
}

.testClass-tree-dropdown .testClass-dropdown-search .testClass-search__field {
  padding: 4px 7px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
}
.testClass-search__field__mirror {
  position: absolute;
  top: 0;
  left: 0;
  white-space: pre;
  pointer-events: none;
  opacity: 0;
}

.testClass-tree {
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  padding: 0;
  list-style: none;
  margin: 0;
  padding: 0 4px;
  margin-top: -4px;
}

.testClass-tree li {
  padding: 0;
  margin: 8px 0;
  list-style: none;
  white-space: nowrap;
  outline: 0;
}

.testClass-tree li span.testClass-tree-switcher {
  position: relative;
}

.testClass-tree li span.testClass-tree-switcher,
.testClass-tree li span.testClass-tree-iconEle {
  margin: 0;
  width: 24px;
  height: 24px;
  line-height: 22px;
  display: inline-block;
  vertical-align: middle;
  border: 0 none;
  cursor: pointer;
  outline: none;
  text-align: center;
}

:root .testClass-tree li span.testClass-tree-switcher.testClass-tree-switcher_open .ant-tree-switcher-icon,
:root .testClass-tree li span.testClass-tree-switcher.testClass-tree-switcher_open .testClass-switcher-icon {
  font-size: 12px;
}

.testClass-tree li span.testClass-tree-switcher.testClass-tree-switcher_open .ant-tree-switcher-icon,
.testClass-tree li span.testClass-tree-switcher.testClass-tree-switcher_open .testClass-switcher-icon {
  font-size: 12px;
  font-size: 10px \9;
  transform: scale(0.83333333) rotate(0deg);
  display: inline-block;
  font-weight: bold;
}

.testClass-tree li span.testClass-tree-switcher,
.testClass-tree li span.testClass-tree-iconEle {
  margin: 0;
  width: 24px;
  height: 24px;
  line-height: 22px;
  display: inline-block;
  vertical-align: middle;
  border: 0 none;
  cursor: pointer;
  outline: none;
  text-align: center;
}

.testClass-tree li .testClass-tree-node-content-wrapper {
  display: inline-block;
  padding: 3px 5px;
  border-radius: 2px;
  margin: 0;
  cursor: pointer;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.65);
  transition: all 0.3s;
  width: calc(100% - 24px);
}

.testClass-tree-child-tree-open {
  display: block;
}

.testClass-tree-child-tree {
  display: none;
}

@select-prefix-cls: 'testClass';
@select-tree-prefix-cls: 'testClass-tree';
.iconfont-size-under-12px(@size, @rotate: 0deg) {
  display: inline-block;
  @font-scale: unit(@size / 12px);

  font-size: 12px;
  // IE9
  font-size: ~'@{size} \9';
  transform: scale(@font-scale) rotate(@rotate);
  :root & {
    font-size: 12px; // reset IE9 and above
  }
}

.antTreeSwitcherIcon(@type: 'tree-default-open-icon') {
  .testClass-tree-switcher-icon {
    .iconfont-size-under-12px(10px);

    display: inline-block;
    font-weight: bold;
    svg {
      transition: transform 0.3s;
    }
  }
}

.antTreeShowLineIcon(@type) {
  .testClass-tree-switcher-icon {
    display: inline-block;
    font-weight: normal;
    font-size: 12px;
    svg {
      transition: transform 0.3s;
    }
  }
}
.testClass-tree {
  //.reset-component;

  margin: 0;
  margin-top: -4px;
  padding: 0 4px;
  li {
    margin: 8px 0;
    padding: 0;
    white-space: nowrap;
    list-style: none;
    outline: 0;
    &.filter-node {
      > span {
        font-weight: 500;
      }
    }
    ul {
      margin: 0;
      padding: 0 0 0 18px;
    }
    .testClass-tree-node-content-wrapper {
      display: inline-block;
      width: ~'calc(100% - 24px)';
      margin: 0;
      padding: 3px 5px;
      color: black;
      text-decoration: none;
      border-radius: 3;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        background-color: rgb(230, 247, 255);
      }
      &.testClass-tree-node-selected {
        background-color: #bae7ff;
      }
    }
    span {
      &.testClass-tree-checkbox {
        margin: 0 4px 0 0;
        + .testClass-tree-node-content-wrapper {
          width: ~'calc(100% - 46px)';
        }
      }
      &.testClass-tree-switcher,
      &.testClass-tree-iconEle {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin: 0;
        line-height: 22px;
        text-align: center;
        vertical-align: middle;
        border: 0 none;
        outline: none;
        cursor: pointer;
      }
      &.testClass-icon_loading {
        .testClass-switcher-loading-icon {
          position: absolute;
          left: 0;
          display: inline-block;
          color: gray;
          font-size: 14px;
          transform: none;
          svg {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
          }
        }
      }
      &.testClass-tree-switcher {
        position: relative;
        &.testClass-tree-switcher-noop {
          cursor: auto;
        }
        &.testClass-tree-switcher_open {
          .antTreeSwitcherIcon();
        }
        &.testClass-tree-switcher_close {
          .antTreeSwitcherIcon();
          .testClass-switcher-icon {
            svg {
              transform: rotate(-90deg);
            }
          }
        }

        &.testClass-tree-switcher_open,
        &.testClass-tree-switcher_close {
          .testClass-switcher-loading-icon {
            position: absolute;
            left: 0;
            display: inline-block;
            width: 24px;
            height: 24px;
            color: gray;
            font-size: 14px;
            transform: none;
            svg {
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              margin: auto;
            }
          }
        }
      }
    }
  }

  .testClass-tree-treenode-loading {
    .testClass-tree-iconEle {
      display: none;
    }
  }
  &-child-tree {
    display: none;
    &-open {
      display: block;
    }
  }
  li&-treenode-disabled {
    > span:not(.testClass-tree-switcher),
    > .testClass-tree-node-content-wrapper,
    > .testClass-tree-node-content-wrapper span {
      color: rgba(0, 0, 0, 0.25);
      cursor: not-allowed;
    }
    > .testClass-tree-node-content-wrapper:hover {
      background: transparent;
    }
  }
  &-icon__open {
    margin-right: 2px;
    vertical-align: top;
  }
  &-icon__close {
    margin-right: 2px;
    vertical-align: top;
  }
}

.testClass-tree-dropdown {
  //.reset-component;
  .testClass-dropdown-search {
    position: sticky;
    top: 0;
    z-index: 1;
    display: block;
    padding: 4px;
    background: #fff;
    .testClass-search__field__wrap {
      width: 100%;
    }
    .testClass-search__field {
      box-sizing: border-box;
      width: 100%;
      padding: 4px 7px;
      border: 1px;
      border-radius: 4px;
      outline: none;
    }
    &.testClass-search--hide {
      display: none;
    }
  }
  .testClass-not-found {
    display: block;
    padding: 7px 16px;
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
}

// .ant-select-disabled{
//   background: rgba(0, 0, 0, 0.05) !important;
//   color: #b7b7b7;
// }
</style>