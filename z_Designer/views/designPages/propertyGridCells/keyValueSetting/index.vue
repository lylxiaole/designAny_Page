<template>
  <div>
    <ul>
      <li v-for="(col, i) in currentValue" :key="i">
        <el-row :gutter="5">
          <el-col :span="10">
            <el-input style="margin-bottom: 5px" size="small" v-model="col.key" />
          </el-col>
          <el-col :span="10">
            <el-input style="margin-bottom: 5px" size="small" v-model="col.value" />
          </el-col>
          <el-col :span="4">
            <el-icon size="small" style="cursor: pointer; margin-top: 4px" @click="removeComp(i, col)"><Delete /></el-icon>
          </el-col>
        </el-row>
      </li>
    </ul>
    <el-button type="link" @click="addComp">Add New</el-button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'

import propertyCellBase from '../common'
import { CellSettingAttr } from '../common'
import { PropertyTypeEnum, KeyValue_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'

@CellSettingAttr(PropertyTypeEnum.keyValueSetting)
@Options({})
export default class index extends propertyCellBase<KeyValue_Setting> {
  mounted() {}
  private removeComp(index: number, obj: object) {
    this.currentValue.splice(index, 1)
  }
  private addComp() {
    this.currentValue.push({ key: '', value: '' })
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
