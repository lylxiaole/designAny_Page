 
<template>
  <div>
    <AceEditor v-model:currentCode="currentValue"></AceEditor>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'

@Options({
  components: {}
})
export default class jsonEditor extends Vue {
  mounted() {}
}
</script>



<style scoped>
</style>