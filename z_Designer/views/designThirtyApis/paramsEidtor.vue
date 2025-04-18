<template>
  <div style="height: 100%; width: 100%; position: relative">
    <div style="height: 35px">
      <el-button class="paramvior-list-header-button"
        style="width: 104px; height: 30px; background: rgba(245, 166, 35, 1); color: rgba(255, 255, 255, 1)" @click="addParam">Add New</el-button>
    </div>
    <el-row style="height:35px;border:1px solid #cdcdcd">
      <el-col style="display: flex" class="verticalAlignCenter" :span="4">Index</el-col>
      <el-col style="display: flex" class="verticalAlignCenter" :span="8">Param Name</el-col>
      <el-col style="display: flex" class="verticalAlignCenter" :span="8">Desc</el-col>
      <el-col style="display: flex" class="verticalAlignCenter" :span="4">Options</el-col>
    </el-row>
    <div style="height:calc(100% - 70px);overflow-y:auto;">
      <el-row v-for="(param, index) in params" :key="param.key" style="border:0px 1px 1px 1px;border-style:solid;border-color:#cdcdcd;  border-top-width: 0px;
         border-right-width: 1px; border-left-width: 1px; border-bottom-width: 1px;">
        <el-col style="display: flex;" class="verticalAlignCenter" :span="4">
          <span>{{ index + 1 }}</span>
        </el-col>
        <el-col style="display: flex;" class="verticalAlignCenter" :span="8">
          <editableText style="width: 100%" v-model:value="param.key" />
        </el-col>
        <el-col style="display: flex;" class="verticalAlignCenter" :span="8">
          <editableText style="width: 100%" v-model:value="param.name" />
        </el-col>
        <el-col style="display: flex;" class="verticalAlignCenter" :span="4">
          <el-button @click="()=> {deleteParam(param)}" type="link" style="width:60px;height:25px">
            Delete
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { Prop } from 'vue-property-decorator'
import editableText from '@common/components/Text/editableText.vue'

@Options({
  components: { editableText }
})
export default class paramsEidtor extends PageBase {
  @Prop()
  private params: any[]

  mounted() {}

  private addParam() {
    let index = this.params.length + 1
    this.params.push({ key: 'param' + index, name: 'Param' + index })
  }

  private deleteParam(param) {
    let index = this.params.findIndex((o) => o.key === param.key)
    this.params.splice(index, 1)
  }
}
</script>

<style lang="less">
</style>
