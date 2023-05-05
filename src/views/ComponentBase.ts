import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit } from 'vue-property-decorator'
import { getConfigByName } from '@src/baseConfigs'
import { ElNotification } from 'element-ui/types/notification'
@Options({})
export default class ComponentBase extends Vue {
  //  *******************自定义上下文**********************************************
  protected $lyl_getConfigByName(configName: string) {
    return getConfigByName(configName)
  }

  protected get $lyl_notifyPopup(): ElNotification {
    return this.$notify
  }

  protected get $lyl_systemState(): any {
    return this.$store.state.system
  }
  protected get $lyl_appState(): any {
    return this.$store.state.app
  }
  protected $lyl_setSystemState(stateKey: string, val: any) {
    this.$store.commit('system/setKeyValueMutation', { key: stateKey, value: val })
  }

  protected $lyl_setAppState(stateKey: string, val: any) {
    this.$store.commit('app/setKeyValueMutation', { key: stateKey, value: val })
  }
  //  *****************************************************************

  mounted() {}
}
