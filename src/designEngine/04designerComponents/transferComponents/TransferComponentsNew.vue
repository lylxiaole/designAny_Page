<template>
  <a-transfer :listStyle="listStyle" :titles="transferTitles" :operations="operationsTitle" :dataSource="dataSource" :targetKeys="targetKeys"
    :selectedKeys="selectedKeys" :lazy="false" :disabled="traDisabled" @change="change">
    <span slot="body" slot-scope="record">
      <a-input placeholder="请输入" v-show="record.titleText === leftTableSerch" @change="leftChange" @click="testRecord(record)"></a-input>
      <VTable name="source" ref="sourceTable" v-show="record.titleText === leftTitle" :data="leftDataSource" :rowId="rowKey" :columns="leftColumns"
        :showSelection="true" :height="tableHieght" :tableStyle="defaultTableStyle" @select="leftSelect" :selectValues="leftSelectValues"
        :showPagination="false">
      </VTable>
      <a-input placeholder="请输入" v-show="record.titleText === rightTableSerch" @change="rightChange"></a-input>
      <VTable name="target" ref="targetTable" :data="rightDataSource" :rowId="rowKey" v-show="record.titleText === rightTitle" :columns="rightColumns"
        :showSelection="true" :selectValues="rightSelectValues" @select="rightSelect" :showPagination="false" :height="tableHieght"></VTable>
    </span></a-transfer>

  <!-- <g-transfer :data="datasource" :columns="columns" /> -->
</template>

<script lang="ts">
import VTable from '../table/VxeTable'
import ComponentBase from '../ComponentBase'
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  BindingModels_Property,
  Boolean_Property,
  TableStyleSetting_Property,
  Number_Property,
} from '../../02common/commonClasses/LayoutProperty'
import common from '../../02common/commonMethod'
import { columnInfo, tableStyle } from '../table/tableCommonTypes'

enum propertyNameEnum {
  datasource = '表格数据源',
}
enum propertyGroupName {
  transferSetting = '穿梭框设置',
  tableLeftSetting = '左表格设置',
  tableRightSetting = '右表格设置',
}

var defaultTableStyle = function() {
  var etableStyle = new tableStyle()
  etableStyle.canChoose = 1
  etableStyle.showIndex = true
  etableStyle.resizable = true
  etableStyle.border = false
  etableStyle.stripe = true
  etableStyle.showheader = true

  etableStyle.columnInfos = []
  var col1 = new columnInfo()
  col1.field = 'key'
  col1.title = '主键'
  // col1.fixed = "";
  col1.sortable = true
  etableStyle.columnInfos.push(col1)

  var col2 = common.clone(col1)
  col2.field = 'name'
  col2.title = '名称'
  etableStyle.columnInfos.push(col2)
  return etableStyle
}

@Component({
  components: {
    VTable: VTable,
  },
})
export default class TransferComponentNew extends ComponentBase {
  dataSource: any[] = []
  leftDataSource: any[] = []
  _defLeftDataSource: any[] = []
  rightDataSource: any[] = []
  _defRightDataSource: any[] = []
  _datasource: any[]
  targetKeys: any[] = [1]
  selectedKeys: any[] = []
  rowKey: string = 'id' //表格默认属性
  columnField: string[] = []
  leftSelectValues: any[] = []
  rightSelectValues: any[] = []

  //表格
  leftTableSerch: string = ''
  rightTableSerch: string = '' //通过改变标题通知是否显示，否则会重复；

  tableHieght: string = '200px'
  // Mock

  mock() {
    //window.console.log('99999999999999999999999999999mock')
    var _dataSource = [
      {
        accountNo: 1,
        name: 'xuhh',
      },
      {
        accountNo: 2,
        name: '张三',
      },
      {
        accountNo: 3,
        name: 'xuhh222',
      },
      {
        accountNo: 4,
        name: '张三',
      },
      {
        accountNo: 5,
        name: 'wang',
      },
      {
        accountNo: 6,
        name: 'wang',
      },
    ]
    //window.console.log('---------------------------------：', this.rowKey)
    let rowKey = this.rowKey
    this.leftDataSource = _dataSource
    this.targetKeys.forEach((tKey) => {
      let movekey = -1
      for (let index = 0; index < this.leftDataSource.length; index++) {
        const leftItem = this.leftDataSource[index]
        this.dataSource.push({ key: leftItem[rowKey], title: '1111' })
        //window.console.log('---------------------------------', this.rowKey, leftItem[rowKey])
        if (leftItem[rowKey] === tKey) {
          movekey = index
        }
      }
      if (movekey > -1) {
        this.rightDataSource.unshift(this.leftDataSource[movekey])
        this.leftDataSource.splice(movekey, 1)
      }
    })
    //this.dataSource = _dataSource;
    this._Log()
    this.InitDefaultSource()
  }

  private InitDefaultSource() {
    this._defLeftDataSource = []
    this._defRightDataSource = []
    this._defLeftDataSource = Object.assign([], this.leftDataSource)
    this._defRightDataSource = Object.assign([], this.rightDataSource)
  }

  created() {
    this.leftColumns
    //window.console.log('-------------------created leftColumns', this.leftColumns)
    //获取唯一键
    this.RegisterProperty(propertyNameEnum.datasource, PropertyGroupName.normal, null, {}, false, true)
    //属性改变触发
    this.$on('onPropertyChanged', this.onCurrentPropertyChanged)

    /**属性注册 */
    this.RegisterProperty("唯一键", propertyGroupName.transferSetting, new Enum_Property(true, this.columnField), 'id');
    //this.RegisterProperty("是否可点", propertyGroupName.transferSetting, new Boolean_Property(), false);
    this.RegisterProperty("启用搜索", propertyGroupName.transferSetting, new Boolean_Property(), true);
    this.RegisterProperty("源标题", propertyGroupName.transferSetting, new Text_Property(), "源标题");
    this.RegisterProperty("目标标题", propertyGroupName.transferSetting, new Text_Property(), "目标标题");
    this.RegisterProperty("向左指示文字", propertyGroupName.transferSetting, new Text_Property(), "");
    this.RegisterProperty("向右指示文字", propertyGroupName.transferSetting, new Text_Property(), "");
    this.RegisterProperty("中间宽度", propertyGroupName.transferSetting, new Number_Property(), 48);

    /*左表格属性注册*/
    this.RegisterProperty('字体大小', propertyGroupName.tableLeftSetting, new Boolean_Property(), true)
    this.RegisterProperty('字体颜色', propertyGroupName.tableLeftSetting, new Boolean_Property(), true)
    this.RegisterProperty('列样式', propertyGroupName.tableLeftSetting, new TableStyleSetting_Property(), null)
    this.RegisterProperty('是否可选中', propertyGroupName.tableLeftSetting, new Boolean_Property(), true)
    this.RegisterProperty('是否显示序号', propertyGroupName.tableLeftSetting, new Boolean_Property(), true)
    this.RegisterProperty('是否显示边框', propertyGroupName.tableLeftSetting, new Boolean_Property(), false)
    this.RegisterProperty('是否显示线', propertyGroupName.tableLeftSetting, new Boolean_Property(), true)
    this.RegisterProperty('是否可以改变大小', propertyGroupName.tableLeftSetting, new Boolean_Property(), false)

    /*右表格属性注册*/
    // this.RegisterProperty("唯一键", propertyGroupName.tableRightSetting, new Enum_Property(true, this.columnField), true);
    this.RegisterProperty('字体大小', propertyGroupName.tableRightSetting, new Boolean_Property(), true)
    this.RegisterProperty('字体颜色', propertyGroupName.tableRightSetting, new Boolean_Property(), true)
    this.RegisterProperty('列样式', propertyGroupName.tableRightSetting, new TableStyleSetting_Property(), null)
    this.RegisterProperty('是否可选中', propertyGroupName.tableRightSetting, new Boolean_Property(), true)
    this.RegisterProperty('是否显示序号', propertyGroupName.tableRightSetting, new Boolean_Property(), true)
    this.RegisterProperty('是否显示边框', propertyGroupName.tableRightSetting, new Boolean_Property(), false)
    this.RegisterProperty('是否显示线', propertyGroupName.tableRightSetting, new Boolean_Property(), true)
    this.RegisterProperty('是否可以改变大小', propertyGroupName.tableRightSetting, new Boolean_Property(), false)
  }

  mounted() {
    this.leftColumns
    this.getRowKey()
    this.getRowKey()
    this.showTableSearch()
    // window.console.log('表格组件加载了')
    this.width = 800
    this.height = 300
    defaultTableStyle()
  }
  /**基础事件*/
  private onCurrentPropertyChanged(propertyId: string, property: Property, comp: ComponentBase): void {
    //无主动Get
    if (property.propertyName === '启用搜索') {
      this.showTableSearch()
    }
    if (property.propertyName === '向右指示文字' || property.propertyName === '向左指示文字') {
      var val: number = 20 + 18 + 12 + 21 * this.leftOperatorTitle.length
      this.midWidth = val
    }
    if (property.propertyName === '唯一键') {
      this.getRowKey()
    }
    //window.console.log('--------------', propertyId, property)
  }

  /**穿梭框属性 */
  getRowKey(): void {
    var findValue = this.FindProperties(propertyGroupName.transferSetting, '唯一键')[0]
    let key = 'Id'
    if (findValue) {
      var data = 'rowKey-----------------------------:' + findValue + '###:' + findValue.propertyName + '%%%%:' + (findValue.value as string)
      //window.console.log(data, findValue)
      key = findValue.value as string
    }
    //window.console.log('rowKey:', key)
    this.rowKey = key
    this.mock()
  }

  // get traDisabled(): boolean {
  //   if (this.FindProperties(propertyGroupName.transferSetting, "是否可点")[0]) {
  //     return !(this.FindProperties(propertyGroupName.transferSetting, "是否可点")[0].value as boolean)
  //   } 
  //     return false
  // }

  get leftTitle(): string {
    window.console.log('源标题')
    var findValue = this.FindProperties(propertyGroupName.transferSetting, '源标题')[0]
    if (findValue) {
      return findValue.value as string
    } else {
      return ''
    }
  }

  get rightTitle(): string {
    var findValue = this.FindProperties(propertyGroupName.transferSetting, '目标标题')[0]
    if (findValue) {
      return findValue.value as string
    }
    return ''
  }

  get transferTitles(): string[] {
    window.console.log([this.leftTitle, this.rightTitle])
    return [this.leftTitle, this.rightTitle]
  }

  get leftOperatorTitle(): string {
    window.console.log('leftOperatorTitle')
    var findValue = this.FindProperties(propertyGroupName.transferSetting, '向左指示文字')[0]
    if (findValue) {
      return findValue.value as string
    } else {
      return ''
    }
  }

  get rightOperatorTitle(): string {
    window.console.log('rightOperatorTitle')
    var findValue = this.FindProperties(propertyGroupName.transferSetting, '向右指示文字')[0]
    if (findValue) {
      return findValue.value as string
    } else {
      return ''
    }
  }

  get operationsTitle(): string[] {
    return [this.leftOperatorTitle, this.rightOperatorTitle]
  }

  showTableSearch(): boolean {
    window.console.log('启用搜索')
    var findValue = this.FindProperties(propertyGroupName.transferSetting, '启用搜索')[0]
    window.console.log('showTableSearch:', findValue.value as string)
    let showFlag = false
    if (findValue) {
      showFlag = findValue.value as boolean
    }
    if (showFlag) {
      window.console.log('启用搜索1')
      this.leftTableSerch = this.leftTitle
      this.rightTableSerch = this.rightTitle
    } else {
      window.console.log('启用搜索2')
      this.leftTableSerch = ''
      this.rightTableSerch = ''
    }
    window.console.log('showTableSearch:', this.leftTableSerch, this.rightTableSerch)

    return showFlag
  }

  get midWidth(): number {
    var findValue = this.FindProperties(propertyGroupName.transferSetting, '中间宽度')[0]
    if (findValue) {
      window.console.log('midWidthGet:', findValue.value as number)
      return findValue.value as number
    } else {
      return 48
    }
  }

  set midWidth(val: number) {
    var pro = this.FindPropertyByName(propertyGroupName.transferSetting, '中间宽度')
    window.console.log('wwwwwwwwwwwwwwwwwww', pro)
    if (pro) {
      window.console.log('wwwwwwwwwwwwwwwwwww', pro, pro.id)

      this.SetPropertyVal(pro.id, val)
    }
    //
  }
  /**穿梭框样式 */
  get listStyle() {
    //计算表格宽度 没文字48px
    this.leftOperatorTitle
    // var dom = document.getElementsByClassName("ant-transfer-operation");
    window.console.log('-------', this.midWidth, 'leftOperatorTitle', this.leftOperatorTitle)
    let listWith = (this.width - this.midWidth) / 2

    //计算表格高度,搜索框32px，标题34px,边框1px
    this.tableHieght = this.height - 35 - (this.leftTableSerch === this.leftTitle ? 32 : 0) + 'px'
    return { width: listWith + 'px', height: this.height + 'px' }
    //return { width: "350px", height:"100px" }
  }
  /**穿梭框属性结束 */

  /**左表格属性 */
  private defaultTableStyle(): tableStyle {
    var etableStyle = new tableStyle()
    etableStyle.canChoose = 1
    etableStyle.showIndex = true
    etableStyle.resizable = true
    etableStyle.border = true
    etableStyle.stripe = true
    etableStyle.showheader = true

    etableStyle.columnInfos = []
    var prop = this.FindPropertyByName(PropertyGroupName.normal, propertyNameEnum.datasource)
    if (prop) {
      if (this.getPropertyBindInfo(prop.id)) {
        var codeList = this.getPropertyBindInfo(prop.id).modelCodes
        if (codeList && codeList.length > 0) {
          codeList.forEach((element) => {
            var col = new columnInfo()
            col.field = element.code
            col.title = element.codeName
            etableStyle.columnInfos.push(col)
          })
        }
      }
    }
    var actionColumn = new columnInfo()
    actionColumn.title = '操作'
    actionColumn.field = 'action'
    etableStyle.columnInfos.push(actionColumn)

    var proper = this.FindPropertyByName(propertyGroupName.tableLeftSetting, '列样式')
    if (proper) {
      if (proper.value) {
        return proper.value
      }
      proper.value = etableStyle
      return proper.value
    }
    //return etableStyle
  }

  get leftColumns(): any[] {
    var leftColumnsaaa = [
      {
        title: '姓名',
        width: '80px',
        field: 'name',
        dataIndex: 'name',
      },
      {
        title: '账号',
        width: '80px',
        field: 'accountNo',
      },
    ]
    this.columnField = ['name', 'accountNo']
    return leftColumnsaaa
  }

  get rightColumns(): any[] {
    var rightColumns = [
      {
        title: '姓名',
        width: '80px',
        field: 'name',
      },
      {
        title: '账号',
        width: '80px',
        field: 'accountNo',
      },
    ]
    window.console.log(rightColumns)
    return rightColumns
  }
  /**左表格属性结束 */

  /**右表格属性 */
  /**右表格属性结束 */

  /**表格穿梭 */
  change(targetKeys, direction, moveKeys): void {
    window.console.log(targetKeys, direction, moveKeys)
    window.console.log('-------------------this.selectedKeys', this.selectedKeys)
    this.targetKeys = targetKeys
    if (direction === 'right') {
      this.dataSource.forEach((delement) => {
        if (moveKeys.includes(delement.key)) {
          let moveIndex = -1
          for (let index = 0; index < this.leftDataSource.length; index++) {
            const lElement = this.leftDataSource[index]
            if (lElement[this.rowKey] === delement.key) {
              moveIndex = index
              continue
            }
          }
          if (moveIndex >= 0) {
            this.rightDataSource.unshift(this.leftDataSource[moveIndex])
            this.leftDataSource.splice(moveIndex, 1)
          }
        }
      })
      moveKeys.forEach((moveKey) => {
        let skey = this.selectedKeys.findIndex((item) => item === moveKey)
        window.console.log('-------------------rightskey', skey)
        this.selectedKeys.splice(skey, 1)
      })
    } else {
      window.console.log('leftleftleftleftleftleft')
      this.dataSource.forEach((delement) => {
        if (moveKeys.includes(delement.key)) {
          let moveIndex = -1
          for (let index = 0; index < this.rightDataSource.length; index++) {
            const rElement = this.rightDataSource[index]
            if (rElement[this.rowKey] === delement.key) {
              moveIndex = index
              continue
            }
          }
          window.console.log('-------------------rightmoveIndex:', moveIndex)
          if (moveIndex >= 0) {
            this.leftDataSource.unshift(this.rightDataSource[moveIndex])
            this.rightDataSource.splice(moveIndex, 1)
          }
        }
      })
      moveKeys.forEach((moveKey) => {
        let skey = this.selectedKeys.findIndex((item) => item === moveKey)
        window.console.log('-------------------rightskey', skey)
        this.selectedKeys.splice(skey, 1)
      })
    }
    this._Log()
    if (direction === 'right') {
      this.rightSelectValues = this.selectedKeys
    } else {
      this.leftSelectValues = this.selectedKeys
    }
    this.InitDefaultSource()
  }

  /**表格选择事件 */
  leftSelect(selection) {
    window.console.log('----------------------------------------------左侧选中', selection)
    let rightKeys = []
    this.selectedKeys.forEach((element) => {
      let index = this.rightDataSource.findIndex((item) => item[this.rowKey] === element)
      if (index > -1) {
        rightKeys.push(element)
      }
    })
    this.selectedKeys = []
    this.selectedKeys = rightKeys
    selection.forEach((element) => {
      this.selectedKeys.push(element[this.rowKey])
    })

    this._Log()
  }
  rightSelect(selection) {
    window.console.log('----------------------------------------------右侧选中', selection)
    let leftKeys = []
    this.selectedKeys.forEach((element) => {
      let index = this.leftDataSource.findIndex((item) => item[this.rowKey] === element)
      if (index > -1) {
        leftKeys.push(element)
      }
    })
    this.selectedKeys = []
    this.selectedKeys = leftKeys
    selection.forEach((element) => {
      this.selectedKeys.push(element[this.rowKey])
    })

    this._Log()
  }

  /**搜索 */
  handleFilter(direction, filter) {
    const value = filter.target.value
    // this.setState({
    //   window.console.log("setstate");
    // })
    this.dataSource = []
    let directionFlag = direction === 'left'

    let OldHandleDataSource: any[] = []
    if (directionFlag) {
      OldHandleDataSource = this._defLeftDataSource
      this.leftDataSource = []
    } else {
      OldHandleDataSource = this._defRightDataSource
      this.rightDataSource = []
      this.targetKeys = []
    }
    window.console.log('---------------', this.dataSource, this.leftDataSource, this.rightDataSource, this.targetKeys)
    if (!value) {
      window.console.log('default')
      OldHandleDataSource.forEach((element) => {
        if (directionFlag) {
          this.leftDataSource.push(element)
        } else {
          this.rightDataSource.push(element)
          this.targetKeys.push(element[this.rowKey])
        }
      })
    } else {
      OldHandleDataSource.forEach((element) => {
        let data = element as object
        let flag = false
        for (let pop in data) {
          if (!element[pop]) {
            continue
          }
          let popValue: string = element[pop] + ''
          if (popValue.search(value) >= 0) {
            if (directionFlag) {
              this.leftDataSource.push(element)
            } else {
              this.rightDataSource.push(element)
              this.targetKeys.push(element[this.rowKey])
            }
            continue
          }
        }
      })
    }
    this.leftDataSource.forEach((element) => {
      this.dataSource.push({ key: element[this.rowKey] })
    })
    this.rightDataSource.forEach((element) => {
      this.dataSource.push({ key: element[this.rowKey] })
    })
    // this.dataSource.push(this.leftDataSource);
    // this.dataSource.push(this.rightDataSource);
    this._Log()
  }

  leftChange(e, a) {
    window.console.log('左搜索:', e, '----a', a)
    this.handleFilter('left', e)
  }

  rightChange(e) {
    window.console.log('右搜索')
    this.handleFilter('right', e)
  }

  testRecord(e) {
    window.console.log('click:', e)
  }
  /**搜索结束 */

  _Log() {
    window.console.log('------------------------------------')
    window.console.log(':dataSource', this.dataSource)
    window.console.log('::leftDataSource', this.leftDataSource)
    window.console.log(':::rightDataSource', this.rightDataSource)
    window.console.log('::::targetKeys', this.targetKeys)
    window.console.log(':::::selectedKeys', this.selectedKeys)
  }
}
</script>

<style lang="less" scoped>
// /deep/ .ant-transfer-list {
//   height: 350px;
// }
// /deep/.ant-transfer-operation {
//   width: midWidth;
// }
/deep/.ant-checkbox-wrapper {
  display: none;
}
</style>