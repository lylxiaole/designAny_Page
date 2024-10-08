<template>
  <div class="verticalAlignCenter">
    <div :style="{ width: 'auto' }" class="iconitem themeHover" @click="onclick">
      <div style="height: 20px" class="flexHorilanLayout">
        <el-image draggable="false" :src="icon"></el-image>
      </div>
      <div style="height: calc(100% - 20px)" class="flexHorilanLayout verticalAlignCenter">{{ label }}</div>
    </div>
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
  private icon

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
