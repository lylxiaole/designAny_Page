<template>
  <div style="height:100%;width:100%;position:relative">
    <dbList @onCurrentTableChanged="onCurrentTableChanged" style="width:250px;height:100%;float:left">
    </dbList>
    <tableDeatil v-show="currentTable" :currentTable="currentTable" ref="tableIndex" style="width:calc(100% - 250px);height:100%;float:left">
    </tableDeatil>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import dbList from './dbList.vue'
import tableIndex from './logicDB/tableIndex.vue'
import { GetDataBases, AddDataBase, DeleteDatabase, DataBaseDC, TableDC, DeleteTable, UpdateTable, UpdateDatabaseName } from '@common/apis/designDB'
import tableDeatil from './logicDB/tableDeatil.vue'

@Options({
  components: {
    dbList: dbList,
    tableDeatil: tableDeatil
  }
})
export default class index extends PageBase {
  private currentTable: any = null

  mounted() {}

  private async onCurrentTableChanged(table: TableDC) {
    this.currentTable = table
  }
}
</script>

<style>
</style>