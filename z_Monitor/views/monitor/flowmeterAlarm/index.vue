<template>
  <div style="height:100%;width:100%">
    <van-row class="headerCom" :style="headerStyle">
      <van-row style="height:40%;">
        <!-- needNavBack -->
        <van-col :span="12" style="height:100%;display:flex">
          <van-image round width="1.5rem" height="1.5rem" style="align-self:center;margin-left:1.5rem" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
        </van-col>
        <van-col :span="12" style="height:100%;display:flex">
          <span v-if="needNavBack" style="align-self:center;flex:1;text-align:right;margin-right:1.2rem" @click="pageBackClick">返回</span>
        </van-col>
      </van-row>
      <van-row style="height:60%;box-sizing:border-box;padding-bottom:1rem">
        <van-col span="8" style="height:100%;border-right:1px solid #fff;padding-top:0.5rem">
          <div class="headerTitle">计量表</div>
          <div class="headerTitle" style="margin-top:0.3rem">{{flowmeterStatus.zgs}}</div>
        </van-col>
        <van-col span="8" style="height:100%;border-right:1px solid #fff;padding-top:0.5rem">
          <div class="headerTitle">正常</div>
          <div class="headerTitle" style="margin-top:0.3rem">{{flowmeterStatus.zcsl}}</div>
        </van-col>
        <van-col span="8" style="height:100%;padding-top:0.5rem">
          <div class="headerTitle">异常</div>
          <div class="headerTitle" style="margin-top:0.3rem">{{flowmeterStatus.zgs-flowmeterStatus.zcsl}}</div>
        </van-col>
      </van-row>
    </van-row>
    <div class="contentCom" :style="contentStyle">
      <transition name="van-slide-top">
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </div>
    <van-tabbar class="bottomBar" :style="bottomBarStyle" :value="activeItemIndex" @change="onTabChange">
      <van-tabbar-item>
        <template #icon="props">
          <img v-show="props.active" :src="firstPageBarIcon_solid" />
          <img v-show="!props.active" :src="firstPageBarIcon_normal" />
        </template>
        <span>首页</span>
      </van-tabbar-item>

      <van-tabbar-item>
        <template #icon="props">
          <img v-show="props.active" :src="flowmeterBarIcon_solid" />
          <img v-show="!props.active" :src="flowmeterBarIcon_normal" />
        </template>
        <span>流量计</span>
      </van-tabbar-item>

      <van-tabbar-item>
        <template #icon="props">
          <img v-show="props.active" :src="alarmInfoBarIcon_solid" />
          <img v-show="!props.active" :src="alarmInfoBarIcon_normal" />
        </template>
        <span>报警信息</span>
      </van-tabbar-item>

      <van-tabbar-item>
        <template #icon="props">
          <img v-show="props.active" :src="positionBarIcon_solid" />
          <img v-show="!props.active" :src="positionBarIcon_normal" />
        </template>
        <span>位置</span>
      </van-tabbar-item>

      <van-tabbar-item>
        <template #icon="props">
          <img v-show="props.active" :src="equipmentBarIcon_solid" />
          <img v-show="!props.active" :src="equipmentBarIcon_normal" />
        </template>
        <span>设备台账</span>
      </van-tabbar-item>

    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk, appTokenValidate } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { param2Obj } from '@src/utils'
// *****************************************************************

@Component({
  components: {}
})
export default class Index extends PageBase {
  // ********************************************************************************
  mounted() {}
  // ***************底部Tab*********************************************
}
</script>
<style scoped>
</style>
