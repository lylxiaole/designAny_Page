 
 <template>
  <div>
    <el-select v-model="currentValue" size="mini" style="width:120px">
      <el-option v-for="item in allOptions" :key="item" :label="item" :value="item" />
    </el-select>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'

import propertyCellBase from '../common'
import { CellSettingAttr } from '../common'
import { PropertyTypeEnum, Enum_Setting } from '@designEngine/index'

@CellSettingAttr(PropertyTypeEnum.enum)
@Options({
  components: {}
})
export default class index extends propertyCellBase<Enum_Setting> {
  private get allOptions(): any[] {
    return this.currentPropertySetting.enums
  }
}
</script>



<style scoped>
</style> 