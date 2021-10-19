<template>
  <el-dialog
    :show-close="false"
    title="提示"
    :visible.sync="dialogVisible"
    width="700px"
    center
  >
    <div style="width: 100%; height: 400px">
      <el-form :inline="true" :model="weihao">
        <el-form-item
          :inline="true"
          v-for="(item, index) in searchInfo"
          :key="index"
          :label="item.label"
        >
          <el-input size="small" :disabled="true" v-model="item.val"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancelChoose">取 消</el-button>
      <el-button type="primary" @click="onSureChoose">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import ComponentBase from "@src/views/ComponentBase";
import {
  jkzl,
  jlbjk,
  getFlowmetersInArea,
  jlbzdcx,
} from "../../../serviceAPIs/service";
import { Route } from "vue-router";
// *****************************************************************
/***流量计数据对比 */
@Component({
  components: {},
})
export default class index extends ComponentBase {
  private areaList: any[] = [];
  private searchInfo: any[] = [];
  private dialogVisible: boolean = false;
  // ********************************************************************************
  mounted() {}
  // ************************************************************
  public showCompareData(data: any) {
    this.dialogVisible = true;
    this.searchInfo = data;
  }
  // ************************************************************
  private async onSureChoose() {
    this.dialogVisible = false;
    this.onSure();
  }
  private async onCancelChoose() {
    this.dialogVisible = false;
    this.onCancel();
  }
  @Emit("onSure")
  private onSure() {}

  @Emit("onCancel")
  private onCancel() {}
}
</script>
<style scoped>
</style>
