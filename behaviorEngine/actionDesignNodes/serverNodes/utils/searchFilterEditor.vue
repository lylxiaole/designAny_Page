<template>
  <el-row style="width: 100%; height: 30px;margin-top:3px">
    <!-- // -->
    <el-col :span="6" class="flexHorilanLayout verticalAlignCenter">
      <el-select v-model="selectedColumnCode" placeholder="列名" size="small" style="width: 90%">
        <el-option v-for="col in columns" :key="col.columnId" :label="col.columnName" :value="col.columnCode" />
      </el-select>
    </el-col>
    <!-- // -->
    <el-col :span="6" class="flexHorilanLayout verticalAlignCenter">
      <el-select v-model="filterString" placeholder="筛选条件" size="small" style="width: 90%">
        <el-option label="大于" value=">" />
        <el-option label="小于" value="<" />
        <el-option label="等于" value="=" />
        <el-option label="包含" value="Contains" />
      </el-select>
    </el-col>
    <!-- // -->
    <el-col :span="6" class="flexHorilanLayout verticalAlignCenter">
      <el-select v-model="selecedInparamId" placeholder="入参" size="small" style="width: 90%">
        <el-option v-for="inparam in allInparams" :key="inparam.key" :label="inparam.name" :value="inparam.key" />
      </el-select>
    </el-col>
    <!-- // -->
    <el-col :span="3" class="flexHorilanLayout verticalAlignCenter">
      <el-select v-if="!isLast" v-model="filterEndString" placeholder="" size="small" style="width: 90%">
        <el-option label="且" value="and" />
        <el-option label="或" value="or" />
      </el-select>
    </el-col>
    <!-- // -->
    <el-col :span="3" class="flexHorilanLayout verticalAlignCenter">
      <el-button type="info" :icon="deleteIcon" circle @click="onDelete" style="height:25px;width:25px" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { inject, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'
import { Delete } from '@element-plus/icons-vue'
export class seacrchFilter {
  columnCode: string
  filter: string
  inParamId: string
  filterEnd: string
}

@Options({
  components: { Delete }
})
export default class searchFilterEditor extends Vue {
  private deleteIcon: any = Delete

  @Prop()
  private columns: any[]

  @Prop()
  private allInparams: any[]

  @Prop()
  private filter: seacrchFilter

  @Prop()
  private isLast: boolean

  private get selectedColumnCode() {
    if (!this.filter) {
      return null
    }

    return this.filter.columnCode
  }
  private set selectedColumnCode(code: string) {
    if (!this.filter) {
      return
    }

    this.filter.columnCode = code
    this.$emit('update:filter', this.filter)
  }

  private get filterString() {
    if (!this.filter) {
      return null
    }
    return this.filter.filter
  }
  private set filterString(filter: string) {
    if (!this.filter) {
      return
    }
    this.filter.filter = filter
    this.$emit('update:filter', this.filter)
  }

  private get selecedInparamId() {
    if (!this.filter) {
      return null
    }
    return this.filter.inParamId
  }
  private set selecedInparamId(id: string) {
    if (!this.filter) {
      return
    }
    this.filter.inParamId = id
    this.$emit('update:filter', this.filter)
  }

  private get filterEndString() {
    if (!this.filter) {
      return null
    }
    return this.filter.filterEnd
  }
  private set filterEndString(str: string) {
    if (!this.filter) {
      return
    }
    this.filter.filterEnd = str
    this.$emit('update:filter', this.filter)
  }

  mounted() {}
  //**************************** */
  @Emit('onDelete')
  private onDelete() {}
}
</script>

<style lang="less" scoped></style>
