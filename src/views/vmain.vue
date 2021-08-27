<template>
  <div class="example">{{ msg }}
    <div ref="ppap"></div>
  </div>
</template>

<script lang="ts">
// import { Prop, Component, Emit  } from 'vue-property-decorator'

import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
// import TextComp from  '../components/TextComp'
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