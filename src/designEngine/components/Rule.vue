<template>
  <div style="width:100%;height:100%;overflow:auto;position:relative;border-left: 1px solid #555;border-top: 1px solid #555;">
    <div class="rule-hor flexHorilanLayout" style="z-index:99">
      <template v-for="t in horTicks">
        <div v-if="t.tickVal%10===0" :style="{'margin-left':t.diatancePixel+'px'}" class="tick-long" :key="t.tickVal">{{t.tickVal+'cm'}}</div>
        <div v-else :style="{'margin-left':t.diatancePixel+'px'}" class="tick" :key="t.tickVal">&nbsp;</div>
      </template>
    </div>
    <div class="rule-ver" style="z-index:99">
      <template v-for="t in verTicks">
        <div v-if="t.tickVal%10===0" :style="{'margin-top':t.diatancePixel+'px'}" class="tick-long" :key="t.tickVal">{{t.tickVal+'cm'}}</div>
        <div v-else :style="{'margin-top':t.diatancePixel+'px'}" class="tick" :key="t.tickVal">&nbsp;</div>
      </template>
    </div>
    <div>
      <slot name="content">
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
// require('./assets/iconfont1/iconfont')

import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { toString } from 'xe-utils/methods'

class tick {
  diatancePixel: number
  tickVal: number
}

@Component
export default class Rule extends Vue {
  private horTicks: tick[] = []
  private verTicks: tick[] = []

  mounted() {
    this.cuteHorTicks()
    this.cuteVerTicks()
  }

  updated() {}

  // 1厘米 = 0.3937008英寸
  private cuteHorTicks() {
    let dpi = this.getDPI()[0]
    //width是像素
    let width = $((this.$slots.content[0] as any).child.$el).width() + 50
    //horLength是厘米
    let horLength = parseInt((width / dpi / 0.3937008).toString())
    let distance = width / horLength
    window.console.log('horLength:', horLength)
    for (let index = 1; index < horLength; index++) {
      this.horTicks.push({
        tickVal: index,
        diatancePixel: distance
      })
    }
  }
  // 1厘米 = 0.3937008英寸
  private cuteVerTicks() {
    let dpi = this.getDPI()[1]
    let height = $((this.$slots.content[0] as any).child.$el).height() + 50
    let verlength = parseInt((height / dpi / 0.3937008).toString())
    window.console.log('verlength:', verlength)
    let distance = height / verlength
    for (let index = 1; index < verlength; index++) {
      this.verTicks.push({
        tickVal: index,
        diatancePixel: distance
      })
    }
  }

  private getDPI() {
    var arrDPI = new Array()
    if ((window.screen as any).deviceXDPI != undefined) {
      //ie 9
      arrDPI[0] = (window.screen as any).deviceXDPI
      arrDPI[1] = (window.screen as any).deviceYDPI
    } else {
      //chrome firefox
      var tmpNode = document.createElement('DIV') as any
      tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
      document.body.appendChild(tmpNode)
      arrDPI[0] = parseInt(tmpNode.offsetWidth)
      arrDPI[1] = parseInt(tmpNode.offsetHeight)
      tmpNode.parentNode.removeChild(tmpNode)
    }
    return arrDPI
  }
}
</script>

<style lang="less" scoped>
.flexHorilanLayout {
  display: flex;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: center;
}

.rule-hor {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 15px;
  .tick {
    position: relative;
    width: 1px;
    height: 8px;
    background: #000;
  }
  .tick-long {
    position: relative;
    width: 1px;
    height: 15px;
    background: #000;
  }
}

.rule-ver {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 2px;
  height: 100%;
  .tick {
    position: relative;
    width: 8px;
    height: 1px;
    background: #000;
  }
  .tick-long {
    position: relative;
    width: 15px;
    height: 1px;
    background: #000;
  }
}
</style>