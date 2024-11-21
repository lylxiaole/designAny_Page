<template>
  <div class="verticalAlignCenter">
    <div :style="{ width: 'auto' }" class="iconitem themeHover" :title="tooltiptext" @click="onclick">
      <div style="height: 20px; position: relative" class="flexHorilanLayout">
        <el-image v-if="enable" draggable="false" style="width: 20px; height: 20px" fit="contain" :src="enableIcon"></el-image>
        <el-image v-else draggable="false" style="width: 20px; height: 20px" fit="contain" :src="disableIcon"></el-image>
      </div>
      <div style="height: calc(100% - 20px)" class="flexHorilanLayout verticalAlignCenter">{{ label }}</div>
    </div>
    <!-- ***************************** -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'

@Options({})
export default class optionBtn extends Vue {
  @Prop()
  private label

  @Prop()
  private tooltiptext

  @Prop()
  private enableIcon
  @Prop()
  private disableIcon

  @Prop({
    default: () => {
      return true
    }
  })
  private enable

  private onclick(e) {
    this.$emit('click', e)
  }
}
</script>

<style lang="less" scoped>
.iconitem {
  padding: 4px 4px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  color: white;
}
.iconitem .iconfont {
  font-size: 20px;
}
</style>
