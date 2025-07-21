<template>
  <el-dialog v-model="dialogFormVisible" title="字典管理" style="width:400px;height:250px;margin: 0px;" append-to-body :destroyOnClose="true"
    :close-on-click-modal="false" :close-on-press-escape="false">
    <!-- ************************************************* -->
    <div style="height: calc(100% - 60px);width:100%;position:relative">
      <el-form :model="apidata" label-width="80px">
        <el-form-item label="名称" size="small">
          <el-input v-model="apidata.apiName" style="width:200px" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="apidata.type" placeholder="Select" size="small" style="width:200px">
            <el-option :key="0" label="Restful接口" :value="0" />
            <el-option :key="1" label="定时服务" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tip.desc')">
          <el-input v-model="apidata.desc" size="small" style="width:200px" />
        </el-form-item>
      </el-form>
    </div>
    <!-- ************************************************* -->
    <template #footer>
      <div class="verticalAlignCenter flexHorilanLayout" style="width:100%;height:60px">
        <el-button @click="dialogFormVisible = false">{{$t('opts.cancel')}}</el-button>
        <el-button @click="onSureAdd">{{$t('opts.sure')}}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DeleteDictionary, GetAll } from '@common/apis/designDictionary'
import { DesignedAPIDC } from '@common/apis/designApi'
import { Emit } from 'vue-property-decorator'

@Options({
  components: {}
})
export default class addApiDialog extends PageBase {
  private dialogFormVisible: boolean = false
  private apidata: any = null
  public show(data?) {
    if (data) {
      this.apidata = data
    } else {
      this.apidata = {
        apiName: '',
        type: 0,
        desc: '',
        enable: false,
        timerRule: null
      }
    }

    this.dialogFormVisible = true
  }
  // ********************************************
  private onSureAdd() {
    this.dialogFormVisible = false
    this.onSure(this.apidata)
  }

  @Emit('onSure')
  private onSure(data: any) {}
}
</script>

<style lang="less"></style>
