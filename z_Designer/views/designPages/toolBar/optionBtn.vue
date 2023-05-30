<template>
  <div class="verticalAlignCenter">
    <div :style="{ width:'60px'}" class="iconitem themeHover" @click="onclick">
      <div class="flexHorilanLayout">
        {{icon}}
      </div>
      <div class="flexHorilanLayout verticalAlignCenter">{{label}}</div>
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
    this.$emit(event)
  }
}
</script>

<style  lang="less" scoped>
.iconitem {
  padding: 8px 0px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  color: white;
}
.iconitem .iconfont {
  font-size: 26px;
}
</style>