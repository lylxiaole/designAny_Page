import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getConfigByName } from '@common/baseConfigs'
import { ElMessage, Message } from 'element-plus'
@Options({})
export default class ComponentBase extends Vue {
  //  *******************自定义上下文**********************************************
  protected $lyl_getConfigByName(configName: string) {
    return getConfigByName(configName)
  }

  protected get $lyl_msgPopup(): Message {
    return ElMessage
  }

  protected get $lyl_systemState(): any {
    return null
  }
  protected get $lyl_appState(): any {
    return null
  }
  protected $lyl_setSystemState(stateKey: string, val: any) {
    // this.$store.commit('system/setKeyValueMutation', { key: stateKey, value: val })
  }

  protected $lyl_setAppState(stateKey: string, val: any) {
    // this.$store.commit('app/setKeyValueMutation', { key: stateKey, value: val })
  }
  //  *****************************************************************
}
