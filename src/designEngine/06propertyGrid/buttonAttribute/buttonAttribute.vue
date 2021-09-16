<template>
  <div>
    <a-button type="primary" @click="startEditTable" size="small">设置按钮属性</a-button>
    <geno-modal :maskClosable="false" title="设置按钮属性" v-model="windowVisible" :width="900" @ok="modalSure" @cancel="modalCancel" cancelText="取消"
      okText="确定" :cancelButtonProps="{ props: {icon: 'close'}}" :okButtonProps="{ props: {icon: 'check'}}">
      <a-table size="small" :columns="columns" :dataSource="data" :pagination="false" style="height:450px;" :scroll="{y:420}">
        <template slot="buttonIconType" slot-scope="text,record">
          <div key="buttonIconType">
            <a-radio-group style="width:50%;float:left" :value="record.buttonIconType"
              @change="e=> handleChange(e.target.value,record.key,'buttonIconType')">
              <a-row>
                <a-col>
                  <a-radio :value="1"> 直接设置 </a-radio>
                </a-col>
                <a-col>
                  <a-radio :value="2"> 上传图片</a-radio>
                </a-col>
                <a-col>
                  <a-radio :value="3"> 选择图标库</a-radio>
                </a-col>
              </a-row>
            </a-radio-group>

            <a-tree-select v-if="record.buttonIconType==1" :value="record.buttonIcons" style="width:50%;" size="small"
              :dropdownStyle="{maxHeight:'400px',overflow:'auto'}" placeholder='请选择图标' :allowClear='false' treeDefaultExpandAll
              @change="e=>handleChange(e,record.key,'buttonIcons')">
              <a-tree-select-node v-for="icon in record.allButtonIcons" :value='icon.value' :title="icon.name" :key="icon.value" />
            </a-tree-select>

            <div v-if="record.buttonIconType==2">
              <NpUploadFile :upLoadSize='2' :fileList.sync="record.buttonIconImages" maxFileLength=1 fileType="vectorgraph"></NpUploadFile>
            </div>
            <div v-if="record.buttonIconType==3">
              <a-button type="primary" @click="handleIcon(record)"> 选择图片库</a-button>
            </div>
          </div>
        </template>
        <template slot="buttonTextColor" slot-scope="text,record">
          <div key="buttonTextColor">
            <NpColorPicker :color.sync="record.buttonTextColor"></NpColorPicker>
          </div>
        </template>
        <template slot="buttonBGColor" slot-scope="text,record">
          <div key="buttonBGColor">
            <NpColorPicker :color.sync="record.buttonBGColor"></NpColorPicker>
          </div>
        </template>
        <template slot="buttonFrameColor" slot-scope="text,record">
          <div key="buttonFrameColor">
            <NpColorPicker :color.sync="record.buttonFrameColor"></NpColorPicker>
          </div>
        </template>
      </a-table>
      <template slot="footer">
        <a-button @click="modalCancel" size="small">取消</a-button>
        <a-button type="primary" @click="modalSure" size="small">确定</a-button>
      </template>

      <np-icon ref="chooseIcons" @ok="handleOk" />
    </geno-modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import buttonAttributeInfo from '../../02common/commonClasses/buttonAttributeInfo'
import npColorPicker from '../../07commonComponents/npColorPicker.vue'
import npUploadFile from '../../07commonComponents/npUploadFile.vue'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import npIcon from '../../../../views/npicon/npIcon.vue'

@propertyCellTypeAttr(PropertyTypeEnum.buttonAttribute)
@Component({ components: { NpColorPicker: npColorPicker, NpUploadFile: npUploadFile, npIcon } })
export default class buttonAttribute extends propertyCellBase {
  public windowVisible: boolean = false

  private columns: any[] = [
    {
      title: '按钮状态',
      dataIndex: 'buttonStatus',
      key: 'buttonStatus',
      width: '20%',
    },
    {
      title: '按钮图标',
      dataIndex: 'buttonIconType',
      scopedSlots: { customRender: 'buttonIconType' },
      width: '40%',
    },
    {
      title: '前景色',
      dataIndex: 'buttonTextColor',
      scopedSlots: { customRender: 'buttonTextColor' },
      width: '15%',
    },
    {
      title: '背景色',
      dataIndex: 'buttonBGColor',
      scopedSlots: { customRender: 'buttonBGColor' },
      width: '15%',
    },
    {
      title: '边框颜色',
      dataIndex: 'buttonFrameColor',
      scopedSlots: { customRender: 'buttonFrameColor' },
      width: '10%',
    },
  ]

  private data: buttonAttributeInfo[] = []
  private newbutton(val: string): buttonAttributeInfo {
    var newRow1 = new buttonAttributeInfo()
    newRow1.key = common.getUuid()
    newRow1.buttonStatus = val
    newRow1.buttonIconType = 1
    newRow1.buttonIcons = undefined
    newRow1.buttonTextColor = ''
    newRow1.buttonBGColor = ''
    newRow1.buttonFrameColor = ''
    newRow1.buttonIconImages = []
    return newRow1
  }
  mounted() {
    this.data.push(this.newbutton('正常状态'))
    this.data.push(this.newbutton('鼠标悬浮'))
    this.data.push(this.newbutton('选中状态'))
    this.data.push(this.newbutton('不可点击'))
  }

  private startEditTable() {
    this.windowVisible = true

    if (!this.currentValue) {
      this.data = [this.newbutton('正常状态'), this.newbutton('鼠标悬浮'), this.newbutton('选中状态'), this.newbutton('不可点击')]
      return
    }
    this.data = []
    ;(this.currentValue as buttonAttributeInfo[]).filter((o) => {
      var newbuttoninfo = new buttonAttributeInfo()
      newbuttoninfo.key = o.key
      newbuttoninfo.buttonStatus = o.buttonStatus
      newbuttoninfo.buttonIconType = o.buttonIconType
      newbuttoninfo.buttonIcons = o.buttonIcons
      newbuttoninfo.buttonTextColor = o.buttonTextColor
      newbuttoninfo.buttonBGColor = o.buttonBGColor
      console.info('o.buttonFrameColor', o.buttonFrameColor)
      if (o.buttonFrameColor == undefined) {
        newbuttoninfo.buttonFrameColor = o.buttonBGColor
      } else {
        newbuttoninfo.buttonFrameColor = o.buttonFrameColor
      }
      newbuttoninfo.buttonIconImages = o.buttonIconImages
      this.data.push(newbuttoninfo)
    })
  }

  private modalSure() {
    this.currentValue = common.clone(this.data)
    console.log('this.currentValue: ', this.currentValue)
    this.windowVisible = false
  }
  private modalCancel() {
    this.windowVisible = false
  }

  private handleChange(value: any, key: string, column: string) {
    window.console.log(value + '==' + key + '==' + column)
    //获取data值
    const newData = [...this.data]
    //找到目标行
    const target = newData.filter((item) => key === item.key)[0]
    if (target) {
      ;(target as any)[column] = value //将新的值更新给对应列
      //更新data
      this.data = newData
    }
  }

  private handleOk(record) {
    console.log('recordReturn: ', record)
    const newData = [...this.data]
    //找到目标行
    let target = newData.filter((item) => record.key === item.key)[0]
    console.log('target: ', target);
    if (target) {
      target = record
      //更新data
      this.data = newData
    }
  }
  private handleIcon(record) {
    console.log('record: ', record)
    ;(this.$refs.chooseIcons as any).add(record)
  }
}
</script>