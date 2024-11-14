<template>
  <div style="height: 100%; width: 100%; position: relative">
    <div style="height: 35px">
      <el-button class="paramvior-list-header-button" style="width: 104px; height: 30px; background: rgba(245, 166, 35, 1); color: rgba(255, 255, 255, 1)" @click="addParam">Add New</el-button>
    </div>
    <el-row style="height: 35px; border: 1px solid #cdcdcd">
      <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="2">Index</el-col>
      <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="9">Param Name</el-col>
      <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="9">Desc</el-col>
      <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="4">Options</el-col>
    </el-row>
    <div style="height: calc(100% - 70px); overflow-y: auto; border: 1px solid #cdcdcd">
      <el-row v-for="(param, index) in params" :key="param.key" style="margin-top: 4px">
        <el-col style="display: flex; border: 1px solid #cdcdcd" class="flexHorilanLayout verticalAlignCenter" :span="2">
          <span>{{ index + 1 }}</span>
        </el-col>
        <el-col style="display: flex; border: 1px solid #cdcdcd" class="flexHorilanLayout verticalAlignCenter" :span="9">
          <editableText style="width: 100%" v-model:value="param.key" />
        </el-col>
        <el-col style="display: flex; border: 1px solid #cdcdcd" class="flexHorilanLayout verticalAlignCenter" :span="9">
          <editableText style="width: 100%" v-model:value="param.name" />
        </el-col>
        <el-col style="display: flex; border: 1px solid #cdcdcd" class="flexHorilanLayout verticalAlignCenter" :span="4">
          <el-button
            @click="
              () => {
                deleteParam(param)
              }
            "
            type="link"
          >
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

<style lang="less"></style>
