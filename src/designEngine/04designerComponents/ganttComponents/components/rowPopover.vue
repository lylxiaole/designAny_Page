<template>
  <div>
    <div class="projectMsg" v-if="(this.isPopoverShow&&this.isShowMsg&&this.hasValue)||this.show" :style="{
        left: this.currentProjectMsg.left + 'px',
        top: this.currentProjectMsg.top + 'px',
      }" @mouseover="mouseover($event)" @mouseleave="mouseleave($event)">
      <vxe-table ref="table" size="mini" :show-header="false" :data="this.popMsgList" :style="{'border-collapse': 'separate'}"
        >
        <vxe-table-column field="key" :width="keyValueWidth.keyWidth">
          <template v-slot="{ row }">
            <span class="table-span-key table-span" width="auto">{{ row.key }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="value" :width="keyValueWidth.valueWidth">
          <template v-slot="{ row }">
            <span class="table-span" width="auto">{{ row.value }}</span>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isShowMsg', 'currentProjectMsg', 'isPopoverShow', 'chartDateWidth', 'popMsgList'],
  data() {
    return { show: false }
  },
  methods: {
    mouseover(e) {
      e.preventDefault()
      this.show = true
    },
    mouseleave(e) {
      e.preventDefault()
      this.show = false
    },
  },
  mounted() {},
  computed: {
    keyValueWidth() {
      let keyWidth = 0
      let valueWidth = 0
      this.popMsgList.forEach((child) => {
        if (keyWidth < child.keyWidth) {
          keyWidth = child.keyWidth
        }
        if (valueWidth < child.valueWidth) {
          valueWidth = child.valueWidth
        }
      })
      return { keyWidth: keyWidth + 20, valueWidth: valueWidth + 20 }
    },
    hasValue() {
      if (this.popMsgList && this.popMsgList.length > 0) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    // isShowMsg() {
    //   this.$nextTick(function() {
    //     if (this.$refs.table) {
    //       if (this.timer) clearTimeout(this.timer)
    //       this.timer = setTimeout(() => {
    //         if (this.$refs.table) {
    //           this.$refs.table.$el.getElementsByTagName('table')[0].style.width = 'auto'
    //           for (let i = 0; i < this.$refs.table.$el.getElementsByTagName('table')[0].children[0].children.length; i++) {
    //             this.$refs.table.$el.getElementsByTagName('table')[0].children[0].children[i].style.width = 'auto'
    //           }
    //         }
    //       }, 25)
    //     }
    //   })
    // },
  },
  created() {},
}
</script>

<style scoped>
.projectMsg {
  box-sizing: border-box;
  /* padding: 20px; */
  position: absolute;
  z-index: 99;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #ebeef5;
}
.vxe-table--body {
  width: auto;
}
.lineMsg {
  box-sizing: border-box;
  margin-bottom: 10px;
}
.projectName {
  font-size: 22px;
}
span {
  font-size: 14px;
  color: #909090;
}
table {
  border-collapse: separate;
  border-spacing: 10px 10px;
  width: auto;
}
col {
  width: auto;
}
td {
  white-space: nowrap;
  font-size: 14px;
  color: #909090;
}
.title {
  margin-right: 10px;
}
.table-span {
  font-size: 12px;
  color: #606266;
}
.table-span-key {
  font-weight: bold;
}
.width-auto {
  width: auto;
}
</style>