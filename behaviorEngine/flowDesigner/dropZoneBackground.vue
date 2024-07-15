<template>
  <div class="dropzone-background">

    <div class="overlay">
      <slot />
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
export default class dropZoneBackground extends ComponentBase {
  mounted() {}
}
</script>

<style>
</style>