<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getConfigByName } from '@src/baseConfigs'

@Component
export default class ComponentBase extends Vue {
  protected $getConfigByName(configName: string) {
    return getConfigByName(configName)
  }

  mounted() {}
}
</script>