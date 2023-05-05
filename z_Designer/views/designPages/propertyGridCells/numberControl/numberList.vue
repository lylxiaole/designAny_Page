<template>
  <div>
    <ul>
      <li v-for="(col, i) in currentValue" :key="i">
        <a-row :gutter="5">
          <a-col :span="20">
            <a-input-number style="margin-bottom:5px;" size="small" v-model="col.value" :min="currentPropertyType.min" :max="currentPropertyType.max"
              :defaultValue="currentPropertyType.min" />
          </a-col>
          <a-col :span="4">
            <a-icon size="small" type="minus-circle" @click="removeComp(i,col)" v-if="removeVisible" />
          </a-col>
        </a-row>
      </li>
    </ul>
    <a-button type="link" @click="addComp" v-if="addVisible">添加</a-button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'

import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'

@propertyCellTypeAttr(PropertyTypeEnum.numberList)
@Options({})
export default class numberList extends propertyCellBase {
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
  private addComp() {
    let minCount: number = this.currentPropertyType['minCount']
    let maxCount: number = this.currentPropertyType['maxCount']
    let currentLen: number = this.currentValue.length

    if (maxCount <= currentLen) {
      this.addVisible = false
      return
    }
    let uuid: string = getUuid()
    this.currentValue.push({ key: uuid, value: 0 })

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