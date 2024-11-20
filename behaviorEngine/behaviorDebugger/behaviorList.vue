<template style="height: 100%; width: 100%">
  <el-row v-if="currentPage" style="height: 100%; background: #fff">
    <div style="width: 100%; height: 30px; justify-content: left; overflow: hidden" class="flexHorilanLayout">
      <div style="background: #18aeb7; width: 6px; height: 26px"></div>
      <span style="margin-left: 9px; float: left; fontsize: 18px; fontweight: 600">Behavior List</span>
    </div>

    <div style="height: calc(100% - 30px); width: 100%; overflow-y: auto">
      <el-radio-group v-model="checkedBehaviorId" @change="onSelectBehavior">
        <el-radio v-for="beha in allBehaviors" :key="beha.id" :label="beha.id">
          {{ beha.name }}
        </el-radio>
      </el-radio-group>
    </div>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { EnginePage } from '@design-any/interface/dist/LayoutInterface'

@Options({
  components: {}
})
export default class behaviorList extends Vue {
  private checkedBehaviorId: string = ''
  private allBehaviors: behavior[] = []

  @Prop({
    default: () => {
      return null
    }
  })
  currentPage: EnginePage

  @Watch('currentPage', { immediate: true })
  private oncurrentPageChanged(val) {
    if (!val) {
      this.allBehaviors = []
    } else {
      this.allBehaviors = val.behaviors
    }
    this.checkedBehaviorId = ''
    this.onSelectBehavior(this.checkedBehaviorId)
  }
  private onSelectBehavior(id) {
    let selectedb = this.allBehaviors.find((o) => o.id === id)
    this.onBehaviorChanged(selectedb)
  }

  @Emit('onEditBehavior')
  private onEditBehavior(beha) {}

  @Emit('onBehaviorChanged')
  private onBehaviorChanged(behav: behavior) {}
}
</script>

<style scoped>
.el-radio {
  width: 100%;
}
</style>
