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
            <el-button
              @click="
                () => {
                  editBehavior(beha)
                }
              "
              type="link"
            >
              Edit
            </el-button>
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
          </el-col>
        </el-row>
      </div>
    </div>

    <behaviorDetail ref="behaviorDetail" />
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'

@Options({
  components: {}
})
export default class flowNodeInfo extends Vue {}
</script>

<style scoped></style>
