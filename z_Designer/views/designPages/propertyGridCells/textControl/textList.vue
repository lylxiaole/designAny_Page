<template>
  <div>
    <ul>
      <li v-for="(col, i) in currentValue" :key="col.key">
        <a-row :gutter="5" style="margin-bottom:5px;">
          <a-col :span="12">
            <a-input size="small" placeholder="请输入" v-model="col.value" />
          </a-col>
          <a-col :span="4">
            <a-icon size="small" type="minus-circle" @click="removeComp(i,col)" v-if="removeVisible" />
          </a-col>
          <a-col :span="4">
            <a-icon size="small" type="up-circle" @click="upComp(i,col)" />
          </a-col>
          <a-col :span="4">
            <a-icon size="small" type="down-circle" @click="downComp(i,col)" />
          </a-col>
        </a-row>
      </li>
    </ul>
    <a-button type="link" @click="addComp" v-if="addVisible">添加</a-button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit,Watch,Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.textList)
@Options({})
export default class textList extends propertyCellBase {
  public addVisible: boolean = true
  public removeVisible: boolean = true
  mounted() {
    let minCount: number = this.currentPropertyType['minCount']
    let maxCount: number = this.currentPropertyType['maxCount']
    let currentLen: number = this.currentValue.length
    if (currentLen <= minCount) {
      this.removeVisible = false
    }
    if (currentLen >= maxCount) {
      this.addVisible = false
    }
  }

  private removeComp(index: number, obj: object) {
    let minCount: number = this.currentPropertyType['minCount']
    let maxCount: number = this.currentPropertyType['maxCount']
    let currentLen: number = this.currentValue.length

    if (currentLen <= minCount) {
      this.removeVisible = false
      return
    }
    this.currentValue.splice(index, 1)

    let newCurrentLen: number = this.currentValue.length
    if (newCurrentLen <= minCount) {
      this.removeVisible = false
    }
    if (newCurrentLen < maxCount) {
      this.addVisible = true
    }
  }

  private upComp(index: number, obj: object) {
    if (index > 0) {
      this.currentValue[index] = this.currentValue.splice(index - 1, 1, obj)[0]
    }
  }

  private downComp(index: number, obj: object) {
    if (index < this.currentValue.length - 1) {
      this.currentValue[index] = this.currentValue.splice(index + 1, 1, obj)[0]
    }
  }

  private addComp() {
    let minCount: number = this.currentPropertyType['minCount']
    let maxCount: number = this.currentPropertyType['maxCount']
    let currentLen: number = this.currentValue.length

    if (maxCount <= currentLen) {
      this.addVisible = false
      return
    }
    let uuid: string = getUuid()
    this.currentValue.push({ key: uuid, value: currentLen + 1 })

    let newCurrentLen: number = this.currentValue.length
    if (maxCount <= newCurrentLen) {
      this.addVisible = false
    }
    if (newCurrentLen > minCount) {
      this.removeVisible = true
    }
  }
}
</script>



<style scoped>
ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
  display: list-item;
  margin: 0;
  padding: 0;
  text-align: -webkit-match-parent;
}
</style>