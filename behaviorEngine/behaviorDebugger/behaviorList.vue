<template style="height: 100%; width: 100%">
  <el-row v-if="currentPage" style="height: 100%; background: #fff">

    <div style="height: calc(100% - 30px); width: 100%; overflow-y: auto">
      <el-radio-group v-model="checkedBehaviorId" style="width:100%;display:block">
        <div v-for="behag in allBehaviors()" :key="behag.groupName">
          <div style="width: 100%; height: 30px; justify-content: left; overflow: hidden" class="flexHorilanLayout">
            <div style="background: #18aeb7; width: 6px; height: 26px"></div>
            <span style="margin-left: 9px; float: left;font-size: 18px; font-weight: 600">{{behag.groupName}}</span>
          </div>
          <div style="padding-left:8px">
            <el-radio v-for="(behav,index) in behag.behavLayouts" :key="index" :label="index+'&'+behav.behavior.id"
              :model-value="index+'&'+behav.behavior.id" @change="(e)=>{onSelectBehavior(e,behag,index)}">
              {{ behav.behavior.name }}
            </el-radio>
          </div>
        </div>
      </el-radio-group>
    </div>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { EnginePage, EngineContainer } from '@design-any/interface/dist/LayoutInterface'
import { platform } from '@design-any/interface/dist'
import { getLocale } from '@common/baseConfigs'

class bgroup {
  groupName: string
  behavLayouts: behavLayout[]
}
class behavLayout {
  layout: EngineContainer
  behavior: behavior
}

@Options({
  components: {}
})
export default class behaviorList extends Vue {
  private checkedBehaviorId: string = ''
  private allBehaviors(): bgroup[] {
    if (!this.currentPage) {
      return []
    }
    return this.cuteBehaviorGroup(this.currentPage)
  }
  // ********************************************
  @Prop({
    default: () => {
      return null
    }
  })
  currentPage: EnginePage

  @Watch('currentPage', { immediate: true })
  private oncurrentPageChanged(val) {
    this.checkedBehaviorId = ''
    this.onBehaviorChanged(null, null)
  }

  private cuteBehaviorGroup(page: EnginePage): bgroup[] {
    let res: bgroup[] = []
    //1*****
    let pagegroup: bgroup = { groupName: getLocale().t('tip.PageBehavior'), behavLayouts: [] }
    let pageBahaviors = this.currentPage.behaviors.filter((o) => o.platform === platform.page)
    for (let index = 0; index < pageBahaviors.length; index++) {
      const element = pageBahaviors[index]
      pagegroup.behavLayouts.push({ layout: page, behavior: element })
    }
    res.push(pagegroup)
    //2******
    let dynamicLayoutBehaviors = this.currentPage.behaviors.filter((o) => o.platform === platform.dynamicLayout)
    let dynamicGroup: bgroup = { groupName: getLocale().t('tip.DynamicBehavior'), behavLayouts: [] }

    for (let index = 0; index < dynamicLayoutBehaviors.length; index++) {
      const dynamicLayoutBehavior = dynamicLayoutBehaviors[index]
      let dynamicpages = page.findDynamicLayoutsRecursion(dynamicLayoutBehavior.id)
      dynamicpages.filter((o) => {
        dynamicGroup.behavLayouts.push({ layout: o, behavior: dynamicLayoutBehavior })
      })
    }
    res.push(dynamicGroup)
    //
    return res
  }
  // ********************************************
  private onSelectBehavior(id: string, group: bgroup, behaviorIndex: number) {
    let behavLayout = group.behavLayouts[behaviorIndex]
    let findb = this.currentPage.behaviors.find((o) => o.id === behavLayout.behavior.id)
    this.onBehaviorChanged(findb, behavLayout.layout)
  }

  @Emit('onBehaviorChanged')
  private onBehaviorChanged(behav: behavior, container: EngineContainer) {}
}
</script>

<style scoped>
.el-radio {
  width: 100%;
}
</style>
