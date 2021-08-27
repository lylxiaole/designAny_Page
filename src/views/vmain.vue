<template>
  <div class="example">{{ msg }}
    <div ref="ppap"></div>
  </div>
</template>

<script lang="tsx">  
// import { Prop, Component, Emit  } from 'vue-property-decorator'
 
import { Options, Vue } from 'vue-class-component';
// import TextComp from  '../components/TextComp'
@Options({
  props: { 
  }
})
export default class vmain extends Vue { 
  private msg: string = '我是li'
   mounted()
  {  
    window.console.log(this.$refs.ppap); 
    // ReactDom.render(<TextComp />,this.$refs.ppap)
  }

 
  
}
</script>

<style>
.example {
  color: red;
}
</style>