<template>
  <nptable :dataSource="tableData" :resizable="true" :border="true" :refreshListPromise="refreshList">
    <div slot="npbuttons">
      <vxe-button>刷新</vxe-button>
      <vxe-button>新增</vxe-button>
      <vxe-button>标记/取消</vxe-button>
      <vxe-button>保存</vxe-button>
      <vxe-button>导出.csv</vxe-button>
    </div>
    <div slot="npcolumns">
      <vxe-table-column type="index" width="60"></vxe-table-column>
      <vxe-table-column field="id" title="id"></vxe-table-column>
      <vxe-table-column field="size" title="size"></vxe-table-column>
      <vxe-table-column field="type" title="type"></vxe-table-column>
      <vxe-table-column field="date" title="date"></vxe-table-column>
    </div>
  </nptable>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import nptable from './npTable.vue'
@Component({
  components: {
    nptable: nptable,
  },
})
export default class demo extends Vue {
  tableData: any[] = [
    {
      id: '10000',
      name: '文件夹 10000',
      size: '53k',
      type: '',
      date: '2019-05-16',
      children: [
        {
          id: '11000',
          name: '文件 11000',
          size: '11k',
          type: 'js',
          date: '2019-05-16',
        },
        {
          id: '12000',
          name: '文件夹 12000',
          size: '22k',
          type: '',
          date: '2019-05-16',
          children: [
            {
              id: '12100',
              name: '文件夹 12100',
              size: '60k',
              type: '',
              date: '2019-05-16',
              children: [
                {
                  id: '12110',
                  name: '文件 12110',
                  size: '100k',
                  type: 'html',
                  date: '2019-05-16',
                },
              ],
            },
            {
              id: '122000',
              name: '文件 122000',
              size: '80k',
              type: 'avi',
              date: '2019-05-16',
            },
          ],
        },
      ],
    },
    {
      id: '20000',
      name: '文件 20000',
      size: '66k',
      type: 'png',
      date: '2019-05-16',
    },
    {
      id: '30000',
      name: '文件夹 30000',
      size: '3k',
      type: '',
      date: '2019-05-16',
      children: [
        {
          id: '31000',
          name: '文件夹 31000',
          size: '9k',
          type: '',
          date: '2019-05-16',
          children: [
            {
              id: '31100',
              name: '文件 31100',
              size: 'mp3',
              type: 'js',
              date: '2019-05-16',
            },
            {
              id: '31200',
              name: '文件 31200',
              size: '224k',
              type: 'java',
              date: '2019-05-16',
            },
          ],
        },
        {
          id: '32000',
          name: '文件夹 32000',
          size: '33k',
          type: '',
          date: '2019-05-16',
          children: [
            {
              id: '32100',
              name: '文件 32100',
              size: '35k',
              type: 'mp4',
              date: '2019-05-16',
            },
          ],
        },
      ],
    },
  ]

  created() {}

  refreshList() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
  }
}
</script>
