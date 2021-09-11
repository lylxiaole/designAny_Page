<template>
  <div>
    <applicationList></applicationList>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import applicationList from './applicationList.vue'
@Component({
  components: {
    applicationList: applicationList
  }
})
export default class index extends PageBase {
  mounted() {
    window.console.log('xxxxxxxxxxxxxxxxxxxxxxx')
  }
}
</script>

<style>
</style>