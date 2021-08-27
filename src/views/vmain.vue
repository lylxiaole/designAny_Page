<template>
  <div class="example">{{ msg }}
    <div ref="ppap"></div>
  </div>
</template>

<script lang="ts">
// import { Prop, Component, Emit  } from 'vue-property-decorator'

import { Options, Vue, prop } from 'vue-class-component'
// import TextComp from  '../components/TextComp'
@Options({
  props: {}
})
export default class vmain extends Vue {
  msg: string = '11111111'
  mounted() {
    window.console.log(this.$refs.ppap)
    this.msg = 'hahahahah'
    // ReactDom.render(<TextComp />,this.$refs.ppap)
  }
}
</script>

<style>
.example {
  color: red;
}
</style>