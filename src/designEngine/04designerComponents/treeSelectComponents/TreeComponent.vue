<template>
  <div style="width:100%;height:100%;overflow-y:auto;background-color:white;">
    <a-input-search v-show="isShowsearch" style="margin: 20px;margin-bottom: 8px" placeholder="Search" v-model="inputValue" @change="onInputChange"
      :style="{'width':(width-40)+'px'}" />
    <a-tree style="width:100%;" :checkStrictly="checkStrictly" :treeData="treeData" :checkable="treeCheckable" :disabled="disabled"
      @select="selectchange" :defaultExpandAll="true" :style="{backgroundColor:'white',maxHeight:height}" :draggable="draggable" @check="checkData"
      :selectedKeys="selectedKeys" @expand="expand" :expandedKeys="expandedKeys" :autoExpandParent="autoExpandParent" :checkedKeys="checkedKeys">
      <!-- <a-icon slot="smile" type="smile-o" />
      <a-icon slot="frown" type="frown" /> -->
      <!-- <template slot="custom" slot-scope="{selected}">
      <a-icon :type="selected ? 'frown':'frown-o'" />
      </template>-->
    </a-tree>
  </div>
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
  BindingModels_Property
} from '../../03designerLayoutBase'

import { ComponentBase } from '../../03designerLayoutBase'

import { CurrentApis, CurrentContext } from '../../01designerContext'
import { param, paramType } from '../../03designerLayoutBase'
import common from '../../02common/commonMethod'

export class TreeNodeInfo {
  label?: string
  title?: string
  value?: string
  key: string
  isLeaf?: boolean
  disabled?: boolean
  disableCheckbox?: boolean
  selectable?: boolean
  icon?: any
  children?: TreeNodeInfo[]
  tag?: any
}

@Component
export default class TreeComponent extends ComponentBase {
  //@Prop()
  //selectvalue: string

  get draggable(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否支持拖拽')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否支持拖拽').value as boolean
    } else {
      return false
    }
  }
  inputValue: string = ''
  selectedKeys: any[] = []
  expandedKeys: any[] = []
  checkedKeys: any[] = []

  // get selectvalues(): string[] {
  //   if (this.findPropertyByName(PropertyGroupName.special, '选中值')) {
  //     window.console.log(
  //       'this.findPropertyByName(PropertyGroupName.special, "选中值").value',
  //       this.findPropertyByName(PropertyGroupName.special, '选中值').value
  //     )
  //     return this.findPropertyByName(PropertyGroupName.special, '选中值').value
  //   } else {
  //     return ['']
  //   }
  // }

  inparam: param[]
  outparam: param

  //@Prop()
  get checkedvalues(): string[] {
    if (this.findPropertyByName(PropertyGroupName.special, '勾选项')) {
      return this.findPropertyByName(PropertyGroupName.special, '勾选项').value
    } else {
      return ['']
    }
  }

  //disabled: boolean = false
  // get disabled(): boolean {
  //   if (this.findPropertyByName(PropertyGroupName.special, '是否可用')) {
  //     return this.findPropertyByName(PropertyGroupName.special, '是否可用').value === '否' ? true : false
  //   } else {
  //     return false
  //   }
  // }

  get treeCheckable(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否允许多选')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否允许多选').value as boolean
    } else {
      return false
    }
  }

  get checkStrictly(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否取消层级关联')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否取消层级关联').value as boolean
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

  get isShowsearch(): boolean {
    if (this.findPropertyByName(PropertyGroupName.special, '是否显示搜索框')) {
      return this.findPropertyByName(PropertyGroupName.special, '是否显示搜索框').value as boolean
    } else {
      return false
    }
  }

  //checkStrictly: boolean = false

  //选中顶层节点触发，更改选中值和选中的列表值
  selectchange(selectedKeys: any, e: { selected: boolean; selectedNodes: any; node: any; event: any }) {
    window.console.log('选中树---------------', selectedKeys)
    if (!e.selectedNodes[0]) {
      return
    }
    // if (!this.selectKey) {

    // }
    this.selectedKeys = selectedKeys
    //this.selectedKeys.push(e.selectedNodes[0].data.props.key)
    let selectValue = e.selectedNodes[0].data.props.tag
    let childValue = e.selectedNodes[0].data.props.dataRef.children
    //window.console.log('------------------------选中参数xxx', e.selectedNodes[0])
    this.commonSelect(selectValue, childValue)
  }

  checkData(checkedKeys: any, e: { checked: boolean; checkedNodes: any; node: any; event: any }) {
    //遍历选中的id来赋值
    let tempArr = []
    if (e.checkedNodes && e.checkedNodes instanceof Array && e.checkedNodes.length > 0) {
      e.checkedNodes.forEach((element) => {
        if (element.data.props.tag) {
          tempArr.push(element.data.props.tag)
        }
      })
    }
    let prop = this.findPropertyByName(PropertyGroupName.special, '勾选项')
    if (prop) {
      this.setPropertyVal(prop.id, common.clone(tempArr))
    }
    //this.findPropertyByName(PropertyGroupName.special, '勾选项').value = tempArr
    //window.console.log('点击复选框', e)
    //window.console.log('value', checkedKeys)

    if (e.checked) {
      this.triggeEvent('复选框选中事件', common.clone(e.node.dataRef.tag))
    } else {
      //入参不能使用null，使用null的话无法清除之前的入参 xuww 2020-03-16 add
      this.triggeEvent('复选框选中事件', {} as any)
    }
    // window.console.log('event', e)
    this.checkedKeys = checkedKeys
  }

  tempNodeList: TreeNodeInfo[] = []

  mounted() {
    this.width = 200
    //this.height = 30

    //是否允许多选
    this.registerProperty('是否允许多选', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('尺寸', PropertyGroupName.special, new Enum_Property(true, ['大', '中', '小']), '中')
    this.registerProperty('是否取消层级关联', PropertyGroupName.special, new Boolean_Property(), false, false)
    this.registerProperty('是否支持拖拽', PropertyGroupName.special, new Boolean_Property(), false, false)
    this.registerProperty('选中值', PropertyGroupName.special, new BindingModels_Property(), null, true, true)
    this.registerProperty('数据源', PropertyGroupName.special, new BindingModels_Property(), [], false, true)
    this.registerProperty('勾选项', PropertyGroupName.special, new BindingModels_Property(), [], true, true)
    this.registerProperty('是否显示根节点', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('根节点名称', PropertyGroupName.special, new Text_Property(), '全部')
    this.registerProperty('是否显示搜索框', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('选中值子节点', PropertyGroupName.special, new BindingModels_Property(), [], true, true)
    this.registerProperty('是否显示图标', PropertyGroupName.special, new Boolean_Property(), false, true, true)

    this.registerEvents('节点选择事件', '', this.inparam, this.outparam)
    let checkinparam: param[] = []
    checkinparam.push({ name: '当前勾选项', type: paramType.complexType, val: null })
    this.registerEvents('复选框选中事件', '', checkinparam, this.outparam)

    this.registerMethods('加载数据方法', '', this.refreshData, this.inparam, null)

    let selectinparam: param[] = []
    selectinparam.push({ name: '选中值', type: paramType.string, val: null })
    this.registerMethods('指定选中值', '', this.setSelectNode, selectinparam, null)

    let setcheckinparam: param[] = []
    setcheckinparam.push({ name: '勾选数据', type: paramType.complexType, val: null })
    setcheckinparam.push({ name: '关联id', type: paramType.string, val: null })
    this.registerMethods('指定勾选项', '', this.setCheckNode, setcheckinparam, null)

    /**注册组件事件 */
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
  }

  protected loadCompleted(childrenData: any[]) {
    let arr = []
    let prop = this.findPropertyByName(PropertyGroupName.special, '数据源')
    if (prop) {
      arr = common.clone(prop)
      //this.tempNodeList = Object.assign(arr)
    }
    //let propValue = this.findPropertyByName(PropertyGroupName.special, '选中值')
    // this.setPropertyVal(propValue.id, {})
    // this.setPropertyVal(prop.id, [])
    //window.console.log('----------------------------------树组件加载完成', this.treeData)
    this.treeData = this.addRootNode(arr, false)
    //window.console.log('----------------------------------树组件加载完成this.selectedKeys', this.selectedKeys)
    //window.console.log('----------------------------------树组件加载完成111', this.treeData)
    // let checkprop = this.findPropertyByName(PropertyGroupName.special, '勾选项')
    // if (checkprop) {
    //   this.setPropertyVal(checkprop.id, [])
    // }
  }

  //选中的事件是什么

  //查询数据的事件应该怎么暴露出去呢？模糊查询操作和展开查询操作
  treeData: TreeNodeInfo[] = []

  refreshData(nodeList: TreeNodeInfo[]): TreeNodeInfo[] {
    this.findPropertyByName(PropertyGroupName.special, '数据源').value = nodeList
    return nodeList
  }

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    switch (property.propertyName) {
      case '根节点名称':
      case '数据源':
        //window.console.log('--------------------------------树组件数据源变更', property)
        this.treeData = this.addRootNode(common.clone(this.findPropertyByName(PropertyGroupName.special, '数据源').value))
        //window.console.log('--------------------------------树组件数据源变更-this.inputValue', this.inputValue)
        if (this.inputValue) {
          this.search(this.inputValue)
        }
        //this.tempNodeList = Object.assign([], this.findPropertyByName(PropertyGroupName.special, '数据源').value)
        //因为可能会存在设置选中在赋值之前的情况，这里需要重新赋值一下 xuww 2020-03-24
        // if (this.selectKey !== '') {
        //   let param = [this.selectKey]
        //   this.setSelectNode(param)
        // }
        this.selectKey = ''
        break
      default:
        break
    }
  }

  /**
   * 递归查询
   * 整理下思路:全部筛选，然后从底层往上层反推，符合条件的数据需要添加父节点？
   * 有条件查询的时候如果直接使用数据源属性的话，会引发数据源变更，暂时没发现原因，tempNodeList在数据源变更的时候暂不更新
   */
  onInputChange(e: any) {
    let paramSearch = e.target.value
    this.search(paramSearch)
  }

  search(paramSearch: any) {
    let tree = common.clone(this.findPropertyByName(PropertyGroupName.special, '数据源').value)
    //window.console.info('paramSearch', paramSearch)

    if (paramSearch !== '') {
      let res = tree.filter((o) => o.title.toUpperCase().indexOf(paramSearch ? paramSearch.toUpperCase() : '') > -1)
      tree.filter((o) => {
        if (o.children) {
          let childrenNodes = this.onSearChildren(paramSearch, o.children)
          o.children = []
          childrenNodes.filter((p) => {
            let exist = false
            res.forEach((element) => {
              let temp = element.children.find((item) => item.key === p.key)
              if (temp) {
                exist = true
              }
            })
            if (!exist) {
              o.children.push(p)
              let aaa = res.find((single) => single.key === o.key)
              if (aaa) {
                aaa = o
              } else {
                res.push(o)
              }
            }
          })
        }
      })
      this.treeData = this.addRootNode(res)
    } else {
      this.treeData = this.addRootNode(tree)
    }
    this.inputValue = paramSearch
  }

  dataList: any[] = []

  onSearChildren(title: any, tree: any) {
    //window.console.log('开始筛选')
    let res = tree.filter((o) => o.title.toUpperCase().indexOf(title ? title.toUpperCase() : '') > -1)
    tree.filter((o) => {
      if (o.children) {
        let childrenNodes = this.onSearChildren(title, o.children)
        o.children = []
        childrenNodes.filter((p) => {
          let exist = false
          res.forEach((element) => {
            let temp = element.children.find((item) => item.key === p.key)
            if (temp) {
              exist = true
            }
          })
          if (!exist) {
            o.children.push(p)
            res.push(o)
          }
        })
      }
    })
    return res
  }

  //兼容一下查询的情况，查询数据的时候不默认选中
  addRootNode(treeData: TreeNodeInfo[], istriggerEvent: boolean = true) {
    if (!(treeData instanceof Array)) {
      treeData = []
    }
    //window.console.log('添加根节点', treeData)
    let tempData = []
    let rootData = new TreeNodeInfo()
    let prop = this.findPropertyByName(PropertyGroupName.special, '根节点名称')
    if (prop) {
      rootData.title = prop.value
    } else {
      rootData.title = '全部'
    }
    rootData.key = ''
    rootData.children = treeData
    let isshowRoot = this.findPropertyByName(PropertyGroupName.special, '是否显示根节点')
    if (!isshowRoot || isshowRoot.value === true) {
      tempData.push(rootData)
    } else {
      tempData = treeData
    }
    //默认点击第一条
    if (treeData.length > 0) {
      this.selectedKeys = []
      this.selectedKeys.push(treeData[0].key)
      if (!this.expandedKeys.find((item) => item == '')) {
        this.expandedKeys.push('')
      }
      if (istriggerEvent) {
        this.commonSelect(treeData[0].tag, treeData[0].children)
      }
      this.autoExpandParent = true
    } else {
      this.selectedKeys = []
      this.selectedKeys.push('')
      if (istriggerEvent) {
        this.commonSelect('', {})
      }
    }
    return tempData
  }

  selectData: TreeNodeInfo
  expandKey: any
  autoExpandParent: boolean = true
  selectKey: string = ''
  /**
   * 设置选中节点
   * 添加第二个参数，用来区分是勾选还是反选
   * */
  setSelectNode(param: any) {
    //window.console.log('----------------------------------设置树选中方法', param)
    if (param.length < 1) {
      return
    }
    this.$nextTick(() => {
      let isshowRoot = this.findPropertyByName(PropertyGroupName.special, '是否显示根节点')
      //this.selectData = null
      if (!isshowRoot || isshowRoot.value === true) {
        this.recursion(this.treeData[0], param[0])
      } else {
        for (let index = 0; index < this.treeData.length; index++) {
          let item = this.treeData[index]
          if (item.key == param[0]) {
            this.selectData = item
            break
          }
          this.recursion(item, param[0])
        }
        // this.treeData.forEach((item) => {
        //   if (item.key == param[0]){
        //     this.selectData = item
        //   }
        //   else{

        //   }
        // })
      }

      if (!this.selectData) {
        // this.selectKey = param[0]
        // this.selectedKeys = []
        // this.selectedKeys.push('')
        // return
        this.selectData = { key: '', tag: {}, children: null }
      }
      this.selectKey = param[0]
      this.selectedKeys = []
      this.selectedKeys.push(this.selectData.key)
      if (!this.expandedKeys.find((item) => item == this.expandKey)) {
        this.expandedKeys.push(this.expandKey)
      }
      //window.console.log('----------------------------------设置树选中方法--展开节点', this.expandedKeys)
      let selectValue = this.selectData.tag
      let childValue = this.selectData.children
      this.commonSelect(selectValue, childValue)
      this.autoExpandParent = true
    })
    //let key = param[0]
  }

  /**通用的选中方法，点击选中和后台指定数据源都要触发 */
  commonSelect(selectValue: any, childValue: any) {
    var prop = this.findPropertyByName(PropertyGroupName.special, '选中值')
    if (prop && selectValue) {
      this.setPropertyVal(prop.id, common.clone(selectValue))
    }
    if (prop && !selectValue) {
      prop.value = ''
      this.setPropertyVal(prop.id, '')
    }
    //选中值子节点
    let prop11 = this.findPropertyByName(PropertyGroupName.special, '选中值子节点')
    if (prop11) {
      if (childValue) {
        this.setPropertyVal(prop11.id, common.clone(childValue))
      } else {
        this.setPropertyVal(prop11.id, [])
      }
    }
    //window.console.log('----------------------------------选中值子节点', prop11)

    //window.console.log('----------------------------------选中值属性', prop)
    this.$nextTick(() => {
      this.triggeEvent('节点选择事件', selectValue)
    })
  }

  /**折叠展开的事件 */
  expand(expandedKeys: any, { expanded: boolean, node: any }) {
    //window.console.log('----------------------------------展开节点', expandedKeys)
    this.expandedKeys = expandedKeys
    this.autoExpandParent = false
  }

  recursion(item: any, key: any) {
    if (item.children != undefined && item.children.length > 0) {
      for (let index = 0; index < item.children.length; index++) {
        const single = item.children[index]
        if (single.key == key) {
          this.selectData = single
          if (single.children && single.children.length > 0) {
            this.expandKey = single.key
          } else {
            this.expandKey = item.key
          }
          return
        }
        if (single.children && single.children.length > 0) {
          this.recursion(single, key)
        }
      }
    } else {
      if (item.key == key) {
        this.selectData = item
        this.expandKey = item.key
        return
      }
      return
    }
  }

  /** 设置勾选项
   * 两个参数，第一个参数是勾选项列表，第二个参数是匹配的属性
   */
  setCheckNode(param: any) {
    if (!this.treeCheckable) {
      return
    }
    //window.console.log('----------------------------------设置展开行参数', param)
    //this.checkedKeys

    if (param instanceof Array && param.length > 0) {
      let data = param[0].data.content ? param[0].data.content : param[0].data ? param[0].data : param[0]
      let isCheck = param.length === 2 ? true : param[2] === false ? false : true
      //this.checkedKeys = []
      if (isCheck) {
        data.forEach((element) => {
          if (!this.checkedKeys.find((item) => item == element[param[1]])) {
            this.checkedKeys.push(element[param[1]])
          }
        })
      } else {
        data.forEach((element) => {
          let idx = this.checkedKeys.findIndex((item) => item == element[param[1]])
          if (idx > -1) {
            this.checkedKeys.splice(idx, 1)
          }
        })
      }
    }
  }
}
</script>



<style scoped lang='less'>
// /deep/ .ant-tree-checkbox-disabled .ant-tree-checkbox-inner{

// }

/deep/ .ant-tree li span.ant-tree-switcher,
.ant-tree li span.ant-tree-iconEle {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 0;
  line-height: 24px;
  text-align: center;
  vertical-align: top;
  border: 0 none;
  outline: none;
  cursor: pointer;
}
</style>