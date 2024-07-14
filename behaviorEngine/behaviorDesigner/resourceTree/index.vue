<template>
  <div>
    <div style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd">

    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'

@Options({
  components: {}
})
export default class index extends ComponentBase {
  mounted() {}
}
</script>

<style>
</style>