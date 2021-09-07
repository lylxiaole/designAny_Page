<template>
  <div>
    <van-cell title="采集站状态">
      <template #label>
        <van-row>
          <van-col :span="6">
            <div class="middleAlign">
              <van-image round width="3rem" height="3rem" alt="你好" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <div class="middleAlign">
              装卸作业区
            </div>
          </van-col>
          <van-col :span="6">
            <div class="middleAlign">
              <van-image round width="3rem" height="3rem" alt="你好" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <div class="middleAlign">
              油品作业区
            </div>
          </van-col>
          <van-col :span="6">
            <div class="middleAlign">
              <van-image round width="3rem" height="3rem" alt="你好" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <div class="middleAlign">
              码头作业区
            </div>
          </van-col>
          <van-col :span="6">
            <div class="middleAlign">
              <van-image round width="3rem" height="3rem" alt="你好" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
            </div>
            <div class="middleAlign">
              成品作业区
            </div>
          </van-col>
        </van-row>
      </template>
    </van-cell>
    <!-- **************************************************************************** -->
    <van-cell style="margin-top:0.5rem" title="物理区域">
      <template #label>
        <van-row>
          <van-col :span="8" style="padding:0.8rem">
            <div class="middleAlign">
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
            </div>
            <div class="middleAlign">
              装卸作业区(3)
            </div>
          </van-col>
          <van-col :span="8" style="padding:0.8rem">
            <div class="middleAlign">
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
            </div>
            <div class="middleAlign">
              装卸作业区(3)
            </div>
          </van-col>
          <van-col :span="8" style="padding:0.8rem">
            <div class="middleAlign">
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
            </div>
            <div class="middleAlign">
              装卸作业区(3)
            </div>
          </van-col>
        </van-row>
        <van-row>
          <van-col :span="8" style="padding:0.8rem">
            <div class="middleAlign">
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
            </div>
            <div class="middleAlign">
              装卸作业区(3)
            </div>
          </van-col>
          <van-col :span="8" style="padding:0.8rem">
            <div class="middleAlign">
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
            </div>
            <div class="middleAlign">
              装卸作业区(3)
            </div>
          </van-col>
          <van-col :span="8" style="padding:0.8rem">
            <div class="middleAlign">
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
            </div>
            <div class="middleAlign">
              装卸作业区(3)
            </div>
          </van-col>
        </van-row>
      </template>
    </van-cell>
    <!-- **************************************************************************** -->
    <van-cell style="margin-top:0.5rem" title="最近报警信息">
      <template #right-icon>
        <div class="moreBtn">
          <span>更多</span>
          <van-icon name="arrow" />
        </div>
      </template>
      <template #label>
        <alarmInfoCard v-for="item in alarmInfoList" :key="item.key" :cardInfo="item" />
      </template>
    </van-cell>
    <!-- **************************************************************************** -->
    <van-cell style="margin-top:0.5rem" title="维保/巡检计划">
      <template #right-icon>
        <div class="moreBtn">
          <span>更多</span>
          <van-icon name="arrow" />
        </div>
      </template>
      <template #label>
        <van-grid :column-num="2">
          <van-grid-item class="firstGridItem">
            <equipment :cardInfo="{}"></equipment>
          </van-grid-item>
          <van-grid-item>
            <equipment :cardInfo="{}"></equipment>
          </van-grid-item>
        </van-grid>
      </template>
    </van-cell>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import alarmInfoCard from './alarmInfoCard.vue'
import equipment from './equipment.vue'
@Component({
  components: {
    alarmInfoCard: alarmInfoCard,
    equipment: equipment
  }
})
export default class Index extends PageBase {
  private currentRate: number = 100
  private alarmInfoList: any[] = []
}
</script>
<style lang="less" scoped>
.jiliangCard {
  height: 10rem;
  box-sizing: border-box;
  margin: 1rem;
}

.moreBtn {
  display: flex;
  vertical-align: middle;
  text-align: center;
  height: 1.5rem;
  span {
    line-height: 1.5rem;
  }
  i {
    line-height: 1.5rem;
  }
  i:before {
    vertical-align: middle;
    text-align: center;
  }
}
.van-hairline--top::after {
  border-top-width: 0px !important;
}
/deep/ .van-grid-item__content::after {
  border-width: 0px !important;
}

/deep/ .firstGridItem .van-grid-item__content::after {
  border-width: 0px 1px 0px 0px !important;
}
</style>
