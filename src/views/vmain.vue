<template>
  <div class="example">{{ msg }}
    <div ref="ppap"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
@Component
export default class vmain extends Vue {
  msg: string = '11111111'
  mounted() {
    this.msg = 'hahahahah'
  }
}
</script>

<style>
.example {
  color: red;
}
</style>