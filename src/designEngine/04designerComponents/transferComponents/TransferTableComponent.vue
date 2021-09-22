<template>
  <div id="xhh" style="transfer" :aria-disabled="traDisabled" :style="{background:background,width:width,height:height}">
    <div>
      <div style="height:50%">{{leftTitle}}</div>
      <div>
        <tablemix :dataSource="leftDataSource" :disabled="traDisabled" :columns="leftColumns" :showSelection="false" @select="leftSelect"
          :showPagination="false" style="height:50%"></tablemix>
      </div>
    </div>

    <div class="ant-transfer-operation">
      <button type="button" class="ant-btn ant-btn-primary ant-btn-sm" disabled="disabled">
        <i class="anticon anticon-right">
          <svg viewBox="64 64 896 896" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="true" class>
            <path
              d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z" />
          </svg>
          <span>{{rightOperatorTitle}}</span>
        </i>
      </button>
      <button disabled="disabled" type="button" class="ant-btn ant-btn-primary ant-btn-sm">
        <i class="anticon anticon-left">
          <svg viewBox="64 64 896 896" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="true" class>
            <path
              d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z" />
          </svg>
          <span>{{leftOperatorTitle}}</span>
        </i>
      </button>
    </div>
    <div>
      <div style="height:50%">{{rightTitle}}</div>
      <tablemix :dataSource="rightDataSource" :columns="leftColumns" :showSelection="false" @select="leftSelect" :showPagination="false"></tablemix>
    </div>
  </div>
</template>
<script lang="ts">
import table from './table_mix'
import { ComponentBase } from '../../03designerLayoutBase'
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  BindingModels_Property,
  PropertyGroupName,
  Boolean_Property,
  TableStyleSetting_Property
} from '../../03designerLayoutBase'
import tablemix from './table_mix'
import { columnInfo, tableStyle } from '../table/tableCommonTypes'
import common from '../../02common/commonMethod'

enum propertyNameEnum {
  datasource = '表格数据源'
}
enum propertyGroupEnum {
  columnSetting = '列设置',
  bodySetting = '表身设置'
}

var defaultTableStyle = function() {
  var etableStyle = new tableStyle()
  etableStyle.canChoose = 1
  etableStyle.showIndex = true
  etableStyle.resizable = true
  etableStyle.border = true
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

//  var leftTitle: string = "hehehehe";
//  var rightTitle: string = "";

@Component({
  components: {
    tablemix: tablemix
  }
})
export default class TransferTableComponent extends ComponentBase {
  leftDataSource: any[] = []
  rightDataSource: any[] = []
  selectedRowKeys: any[] = []

  // Mock
  private get dataSource(): any[] {
    let _dataSource = [
      {
        accountNo: 1,
        name: '麻子'
      },
      {
        accountNo: 2,
        name: '张三'
      },
      {
        accountNo: 3,
        name: '李四'
      },
      {
        accountNo: 4,
        name: '王二'
      }
    ]
    window.console.log(_dataSource)

    _dataSource.forEach((element) => {})

    return _dataSource

    // return this.getPropertyBindData(
    //   PropertyGroupName.normal,
    //   propertyNameEnum.datasource
    // );
  }

  mounted() {
    // window.console.log('表格组件加载了')
    this.width = 400
    this.height = 300
    this.registerProperty(propertyNameEnum.datasource, PropertyGroupName.normal, null, {}, false, true)

    /**特有属性 */
    this.registerProperty('是否可点', PropertyGroupName.special, new Enum_Property(true, ['是', '否']), '是')

    this.registerProperty('源标题', PropertyGroupName.special, new Text_Property(), '源标题')

    this.registerProperty('目标标题', PropertyGroupName.special, new Text_Property(), '目标标题')
    this.registerProperty('向右指示文字', PropertyGroupName.special, new Text_Property(), '')
    this.registerProperty('向左指示文字', PropertyGroupName.special, new Text_Property(), '')
    this.registerProperty('启用搜索', PropertyGroupName.special, new Enum_Property(true, ['是', '否']), '否')

    /**列*/
    this.registerProperty('字体大小', propertyGroupEnum.columnSetting, new Boolean_Property(), true)
    this.registerProperty('字体颜色', propertyGroupEnum.columnSetting, new Boolean_Property(), true)
    this.registerProperty('列样式', propertyGroupEnum.columnSetting, new TableStyleSetting_Property(), null)
    /** 表身*/
  }

  /**特有属性实现 */
  get traDisabled(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否可点')[0]) {
      window.console.log(1234567890)
      var disabled = (this.findProperties(PropertyGroupName.special, '是否可点')[0].value as string) == '是' ? true : false
      window.console.log(disabled)
      return disabled
    }
    return false
  }

  get leftTitle(): string {
    var findValue = this.findProperties(PropertyGroupName.special, '源标题')[0]
    if (findValue) {
      return findValue.value as string
    } else {
      return ''
    }
  }

  get rightTitle(): string {
    var findValue = this.findProperties(PropertyGroupName.special, '目标标题')[0]
    if (findValue) {
      return findValue.value as string
    }
    return ''
  }

  get leftOperatorTitle(): string {
    var findValue = this.findProperties(PropertyGroupName.special, '向左指示文字')[0]
    if (findValue) {
      return findValue.value as string
    } else {
      return ''
    }
  }

  get rightOperatorTitle(): string {
    var findValue = this.findProperties(PropertyGroupName.special, '向右指示文字')[0]
    if (findValue) {
      return findValue.value as string
    } else {
      return ''
    }
  }

  get leftColumns(): any[] {
    var leftColumnsaaa = [
      {
        title: '姓名',
        width: '80px',
        field: 'name'
      },
      {
        title: '姓名',
        width: '80px',
        field: 'name'
      },
      {
        title: '账号',
        width: '80px',
        field: 'accountNo'
      }
    ]
    return leftColumnsaaa
  }

  get rightColumns(): any[] {
    var rightColumns = [
      {
        title: '姓名',
        width: '80px',
        field: 'name'
      },
      {
        title: '账号',
        width: '80px',
        field: 'accountNo'
      }
    ]
    window.console.log(rightColumns)
    return rightColumns
  }

  /**VTable事件 */
  leftSelect(selection) {
    window.console.log('左侧选中', selection)
    // this.selectedKeys = [];
    // selection.forEach(element => {
    //   this.selectedKeys.push(element.id);
    // });
  }
  rightSelect(selection) {
    window.console.log('左侧选中', selection)
    // this.selectedKeys = [];
    // selection.forEach(element => {
    //   this.selectedKeys.push(element.id);
    // });
  }
}
</script>

<style scoped>
.transfer {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.transferTable {
  width: 45%;
  height: 100%;
}
</style>