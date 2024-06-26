<template>
  <div style="height:100%;width:100%;position:relative">
    <dbList @onCurrentDBChanged="onCurrentDBChanged" style="width:250px;height:100%;float:left">
    </dbList>
    <!-- <applicationDetail :currentApplication="currentApplication" style="width:calc(100% - 250px);height:100%;float:left"></applicationDetail> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import dbList from './dbList.vue'

@Options({
  components: {
    dbList: dbList
  }
})
export default class index extends PageBase {
  private currentDB: any = null

  mounted() {}

  private async onCurrentDBChanged(db: any) {
    this.currentDB = db
  }
}
</script>

<style>
</style>