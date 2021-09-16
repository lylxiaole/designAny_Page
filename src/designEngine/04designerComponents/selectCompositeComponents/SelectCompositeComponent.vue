<template>
  <div>
    <a-select :allowClear="allowClear" :value="uiValue" style="width: 400px" @dropdownVisibleChange="dropdownVisibleChange" @change="handleChange">
      <div slot="dropdownRender" slot-scope="menu">
        <v-nodes :vnodes="menu" />
        <table-component ref="table" :selectedItem="selectedItem" :modelPara="modelPara" @select="rowSelect" />
      </div>
    </a-select>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  Boolean_Property,
  PropertyGroupName,
  Number_Property,
  UploadFile_Property,
} from '../../02common/commonClasses/LayoutProperty'
import ComponentBase from '../ComponentBase'
import TableComponent from '../table/Table.vue'

@Component({
  components: {
    TableComponent: TableComponent,
  },
})
export default class SelectCompositeComponent extends ComponentBase {
  private uiValue: string = 'aaa'
  private options: any[] = [
    {
      label: '北京',
      value: 'beijing',
      title: '北京 010',
      key: '010',
    },
    {
      label: '上海',
      value: 'shanghai',
      key: '021',
    },
    {
      label: '南京',
      value: 'nanjing',
      key: '025',
    },
    {
      label: '杭州',
      value: 'hangzhou',
      key: '0571',
      disabled: true,
    },
  ]

  mounted() {
    this.RegisterProperty('是否允许清空选择框', PropertyGroupName.special, new Boolean_Property(), false)
    this.RegisterProperty('显示值', PropertyGroupName.special, new Text_Property())
    this.RegisterProperty('实际值', PropertyGroupName.special, new Text_Property())
    this.RegisterProperty('数据源', PropertyGroupName.special, new Text_Property())
  }

  handleChange(value: any, option: any) {
    this.uiValue = value
    //console.log(value)
    //console.log(this.displayMember)
  }

  dropdownVisibleChange(param: any) {
    // console.log('param', param)
    setTimeout(() => {
      //console.log('param11', this.$refs.table)
    }, 3000)
  }

  rowSelect(value: any) {}

  //清空选择框属性
  get allowClear(): boolean {
    if (this.FindPropertyByName(PropertyGroupName.special, '是否允许清空选择框')) {
      return this.FindPropertyByName(PropertyGroupName.special, '是否允许清空选择框').value as boolean
    }
  }

  get displayMember(): string {
    if (this.FindPropertyByName(PropertyGroupName.special, '显示值')) {
      return this.FindPropertyByName(PropertyGroupName.special, '显示值').value
    }
  }

  get valueMember(): string {
    if (this.FindPropertyByName(PropertyGroupName.special, '实际值')) {
      return this.FindPropertyByName(PropertyGroupName.special, '实际值').value
    }
  }
}
</script>

<style scoped>
</style>