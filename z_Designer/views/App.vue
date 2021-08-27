<template>
  <div id="app" oncontextmenu="self.event.returnValue=false;self.event.preventDefault()">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
@Component
export default class App extends Vue {
  mounted() {}
}
</script>
<style>
@import '@/assets/css/main.css';
@import '@/assets/css/color-dark.css';
</style>
