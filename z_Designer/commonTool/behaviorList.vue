<template style="height: 100%; width: 100%">
  <el-row v-if="currentPage" style="height: 100%; background: #fff">
    <div style="width: 100%; height: 30px; justify-content: left; overflow: hidden" class="flexHorilanLayout">
      <div style="background: #18aeb7; width: 6px; height: 26px"></div>
      <span style="margin-left: 9px; float: left; fontsize: 18px; fontweight: 600">Behavior List</span>
      <el-button class="behavior-list-header-button" style="width: 104px; height: 30px; background: rgba(245, 166, 35, 1); color: rgba(255, 255, 255, 1); margin-left: 10px" @click="addBehavior">Add Behavior</el-button>
    </div>

    <div style="height: calc(100% - 30px); width: 100%">
      <el-row style="height: 35px">
        <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="2">Index</el-col>
        <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="11">Name</el-col>
        <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="11">Options</el-col>
      </el-row>

      <div style="height: calc(100% - 35px); overflow-y: auto">
        <el-row v-for="(beha, index) in allBehaviors" :key="beha.id" style="margin-top: 4px">
          <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="2">
            <span>{{ index + 1 }}</span>
          </el-col>
          <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="11">
            <editableText v-model:value="beha.name" />
          </el-col>
          <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="11">
            <!-- ****************************** -->
            <el-button
              @click="
                () => {
                  onDesignBehavior(beha)
                }
              "
              type="link"
            >
              Edit
            </el-button>
            <!-- ****************************** -->
            <el-button
              @click="
                () => {
                  deleteBehavior(beha)
                }
              "
              type="link"
            >
              Delete
            </el-button>
            <!-- ****************************** -->
          </el-col>
        </el-row>
      </div>
    </div>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'

import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { deepClone, getUuid } from '@common/utils'
import platform from '@design-any/interface/dist/enums/platform'

import editableText from '@common/components/Text/editableText.vue'
@Options({
  components: { editableText }
})
export default class behaviorList extends Vue {
  @Prop({
    default: () => {
      return null
    }
  })
  currentPage: EnginePage

  @Prop()
  private platform: platform

  private get allBehaviors(): behavior[] {
    if (!this.currentPage) {
      return []
    }
    return this.currentPage.behaviors
  }

  private addBehavior() {
    let newbeh = new behavior()
    newbeh.id = getUuid()
    newbeh.name = 'New Behavior'
    newbeh.workRange = 'page'
    newbeh.variables = []
    newbeh.inparam = {}
    this.allBehaviors.unshift(newbeh)
  }

  private deleteBehavior(record: behavior) {
    let index = this.allBehaviors.findIndex((o) => o.id === record.id)
    this.allBehaviors.splice(index, 1)
  }

  //编辑，跳转到行为细节详情
  @Emit('onDesignBehavior')
  private onDesignBehavior(record: behavior) {}
}
</script>

<style scoped></style>
