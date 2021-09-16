<template>
  <!-- <div class="tableCotainer">  
    @toggle-tree-expand="toggleTreeExpand" -->
  <div class="mytable-style">
    <vxe-table 
      resizable  
      highlight-current-row 
      highlight-hover-row 
      ref="ganttTable" class="ganttTable"  
      :data="tableData"
      :tree-config="{children: 'children',expandAll:true}" 
      :row-style="rowStyle"  
      :radio-config="{labelField: 'name', trigger: 'row'}"
      @toggle-tree-expand="toggleTreeExpand"
      @current-change="currentChangeEvent" 
      @cell-mouseenter="hoverChangeEvent"
      >
      <vxe-table-column type="seq" tree-node show-overflow></vxe-table-column>

      <vxe-table-column field="name" title="Name" show-overflow></vxe-table-column>
      <vxe-table-column field="sex" title="Sex" show-overflow></vxe-table-column>
      <vxe-table-column field="date" title="Date" show-overflow></vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
let count = 0
export default {
  data() {
    return { 
      selectRow: null,
      hoverRow:null, 
      rowClassName:{
        height:'70px',
      },
      // rowHeight:'4px',
      tableData: [
        {
          name: 'test1',
          sex: '男',
          date: '2019-08',
          children: [
            {
              name: 'test2',
              sex: '女',
              date: '2019-08',
              children: [
                {
                  name: 'test3',
                  sex: '男',
                  date: '2019-08',
                },
                {
                  name: 'test11',
                  sex: '男',
                  date: '2019-08',
                },
              ],
            },
            {
              name: 'test7',
              sex: '女',
              date: '2019-08',
              children: [
                {
                  name: 'test9',
                  sex: '男',
                  date: '2019-08',
                },
              ],
            },
          ],
        },
        {
          name: 'test4',
          sex: '男',
          date: '2019-08',
          children: [
            {
              name: 'test5',
              sex: '女',
              date: '2019-08',
            },
            {
              name: 'test15',
              sex: '女',
              date: '2019-08',
            },
          ],
        },
      ], 
    }
  },
  props: [
    'oddRowBackgroundColor', //奇数行颜色
    'evenRowBackgroundColor', //偶数行颜色
    'fontColor',  //行字体颜色
    'rowClickColor',//行选中颜色
    'rowHoverColor',//行悬浮颜色
    'rowHeight',
    ],
  methods: {
    rowStyle({ row}) {
      count++  
      if (row == this.selectRow) {
        return {
          backgroundColor: this.rowClickColor,
          color: this.fontColor,
          height:this.rowHeight+"px",
        }
      } else if(row==this.hoverRow){
         return  {
          backgroundColor: this.rowHoverColor,
          color: this.fontColor,
          height:this.rowHeight+"px",
        }
      }else {
        if (count % 2 == 0) { 
          return {
            backgroundColor: this.oddRowBackgroundColor,
            color: this.fontColor,
            height:this.rowHeight+"px",
          }
        } else {
          return {
            backgroundColor: this.evenRowBackgroundColor,
            color: this.fontColor,
            height:this.rowHeight+"px",
          }
        }
      }
      
    },
    hoverChangeEvent({ row }) {
      //console.log('行悬浮事件')
      //console.log(row) 
      count=0
      this.hoverRow = row  
    },
    currentChangeEvent({ row }) {
      //console.log('行选中事件')
      //console.log(row) 
      count=0
      this.selectRow = row 
    },
    toggleTreeExpand() {
      //console.log('展开收起事件') 
      count=0
    }, 
  
  },
}
</script>
<style lang="less" scoped>
.mytable-style .vxe-body--row.row-green {
  background-color: #187;
  color: #fff;
}
</style>