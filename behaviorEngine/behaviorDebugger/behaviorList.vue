<template style="height: 100%; width: 100%">
  <el-row v-if="currentPage" style="height: 100%; background: #fff">
    <div style="width: 100%; height: 30px; justify-content: left; overflow: hidden" class="flexHorilanLayout">
      <div style="background: #18aeb7; width: 6px; height: 26px"></div>
      <span style="margin-left: 9px; float: left; fontsize: 18px; fontweight: 600">Behavior List</span>
    </div>

    <div style="height: calc(100% - 30px); width: 100%; overflow-y: auto">
      <el-radio-group v-model="checkedBehaviorId" @change="onSelectBehavior">
        <el-radio v-for="beha in allBehaviors" :key="beha.id" :label="beha.id">{{ beha.name }}</el-radio>
      </el-radio-group>
      <!-- <el-row v-for="(beha, index) in allBehaviors" :key="beha.id" style="margin-top: 4px">
        <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="2">
          <span>{{ index + 1 }}</span>
        </el-col>
        <el-col style="display: flex" class="flexHorilanLayout verticalAlignCenter" :span="11">
          <span>{{ beha.name }}</span>
        </el-col>
      </el-row> -->
    </div>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'
import { deepClone, getUuid } from '@common/utils'

@Options({
  components: {}
})
export default class behaviorList extends Vue {
  @Prop({
    default: () => {
      return null
    }
  })
  currentPage: EnginePage

  private checkedBehaviorId: string = ''

  private get allBehaviors(): behavior[] {
    if (!this.currentPage) {
      return []
    }
    return this.currentPage.behaviors
  }

  private onSelectBehavior(id) {
    let selectedb = this.allBehaviors.find((o) => o.id === id)
    this.onBehaviorChanged(selectedb)
  }

  @Emit('onBehaviorChanged')
  private onBehaviorChanged(behav: behavior) {}
}
</script>

<style scoped></style>
