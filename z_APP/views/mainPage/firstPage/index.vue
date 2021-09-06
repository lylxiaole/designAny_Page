<template>
  <van-cell-group>
    <van-cell title="采集站状态">
      <template #label>
        <van-row>
          <van-col :span="6">
            <div>
              <van-image round width="3rem" height="3rem" alt="你好" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
              <br />
              <span>装卸作业区</span>
            </div>
          </van-col>
          <van-col :span="6">
            <div>
              <van-image round width="3rem" height="3rem" alt="你好" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
              <br />
              <span>油品作业区</span>
            </div>
          </van-col>
          <van-col :span="6">
            <div>
              <van-image round width="3rem" height="3rem" alt="你好" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
              <br />
              <span>码头作业区</span>
            </div>
          </van-col>
          <van-col :span="6">
            <div>
              <van-image round width="3rem" height="3rem" alt="你好" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
              <br />
              <span>成品作业区</span>
            </div>
          </van-col>
        </van-row>
      </template>
    </van-cell>
    <!-- **************************************************************************** -->
    <van-cell title="物理区域">
      <template #label>
        <van-row>
          <van-col :span="8" style="padding:0.8rem">
            <div>
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
              <br />
              <span>装卸作业区(3)</span>
            </div>
          </van-col>
          <van-col :span="8" style="padding:0.8rem">
            <div>
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
              <br />
              <span>装卸作业区(3)</span>
            </div>
          </van-col>
          <van-col :span="8" style="padding:0.8rem">
            <div>
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
              <br />
              <span>装卸作业区(3)</span>
            </div>
          </van-col>
        </van-row>
        <van-row>
          <van-col :span="8" style="padding:0.8rem">
            <div>
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
              <br />
              <span>装卸作业区(3)</span>
            </div>
          </van-col>
          <van-col :span="8" style="padding:0.8rem">
            <div>
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
              <br />
              <span>装卸作业区(3)</span>
            </div>
          </van-col>
          <van-col :span="8" style="padding:0.8rem">
            <div>
              <van-circle v-model="currentRate" :rate="30" :speed="100" text="30%" size="4rem" />
              <br />
              <span>装卸作业区(3)</span>
            </div>
          </van-col>
        </van-row>
      </template>
    </van-cell>
    <!-- **************************************************************************** -->
    <van-cell title="最近报警信息" is-link arrow-direction="right" value="更多">
      <template #label>
        <alarmInfoCard v-for="item in alarmInfoList" :key="item.key" :cardInfo="item" />
      </template>
    </van-cell>
    <!-- **************************************************************************** -->
    <van-cell title="维保/巡检计划" is-link arrow-direction="right" value="更多">
      <template #label>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import alarmInfoCard from './alarmInfoCard.vue'

@Component({
  components: {
    alarmInfoCard: alarmInfoCard
  }
})
export default class Index extends PageBase {
  private currentRate: number = 100
  private alarmInfoList: any[] = []
}
</script>
<style scoped>
.jiliangCard {
  height: 10rem;
  box-sizing: border-box;
  margin: 1rem;
}
</style>
