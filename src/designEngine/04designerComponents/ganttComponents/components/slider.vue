<template>
  <div
    class="slider"
    ref="slider"
    :style="{ width: '100%',height: rowInHeight+'px',background:colorList.taskColor,}"
  >
    <div
      class="process"
      :style="{ width,height: rowInHeight+'px' ,background:colorList.taskPerColor}"
    >
      <div
        class="perDiv"
        v-if="percentage>0"
        :style="{width,height:rowInHeight+'px'}"
      >
        <div
          class="perSpan"
          :style="{width,height:rowInHeight+'px','font-size':fontsize+'px','line-height':rowInHeight+'px'}"
        >
          {{ percentage }}%
        </div>
      </div>
    </div>
    <div
      class="thunk"
      ref="trunk"
      :style="{ left ,top:'-13px' }"
    >
      <div class="block">
        <!-- <a-icon type="caret-up" @mousedown.stop="thunkMousedown" /> -->
      </div>
      <div
        class="tips"
        v-if="isMove"
      >
        <span>{{ parseInt(scale * 100) }}</span>
        <i class="fas fa-caret-down" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['min', 'max', 'value', 'widths', 'id', 'parentId', 'disable', 'rowInHeight', 'rowHeight', 'colorList'],
  data() {
    return {
      //滚动条DOM元素
      slider: null,
      //拖拽DOM元素
      thunk: null,
      //当前值
      percentage: this.value,
      //当前是否拖拽tip
      isMove: false,
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.percentage = newValue
    },
  },
  methods: {
    thunkMousedown(e) {
      if (this.disable == false) return
      let width = parseInt(this.width)
      let disX = e.clientX
      this.$emit('thunkMousedown')
      this.isMove = true
      document.onmousemove = (e) => {
        let newWidth = e.clientX - disX + width
        let scale = newWidth / this.slider.offsetWidth
        this.percentage = Math.ceil((this.max - this.min) * scale + this.min)
        this.percentage = Math.max(this.percentage, this.min)
        this.percentage = Math.min(this.percentage, this.max)
        this.$emit('thunkMousemove', e, this.index)
      }
      document.onmouseup = (event) => {
        this.isMove = false
        this.$emit('thunkMouseup', parseInt(this.scale * 100), event, this.id, this.parentId)
        document.onmousemove = document.onmouseup = null
      }
      return false
    },
  },
  //渲染到页面的时候
  mounted() {
    this.slider = this.$refs.slider
    this.thunk = this.$refs.trunk
  },
  computed: {
    fontsize() {
      return this.rowHeight * 0.3
    },
    scale() {
      return (this.percentage - this.min) / (this.max - this.min)
    },
    width() {
      if (this.slider) {
        return this.widths * this.scale + 'px'
      } else {
        return 0 + 'px'
      }
    },
    height() {
      if (this.slider) {
        return this.slider.offsetHeight + 'px'
      } else {
        return 0 + 'px'
      }
    },
    left() {
      if (this.slider) {
        return this.widths * this.scale - this.thunk.offsetWidth / 2 + 'px'
      } else {
        return 0 + 'px'
      }
    },
  },
}
</script>
<style scoped>
.perDiv {
  display: table-cell;
  vertical-align: middle;
  /* text-align: center; */
  margin: 0 auto;
  /* font-size: 12px; */
  color: #fff;
}
.perSpan{
  white-space:nowrap;
}
.box {
  margin: 100px auto 0;
  width: 80%;
}
.clear:after {
  content: '';
  display: block;
  clear: both;
}
.slider {
  position: relative;
  /* height: 12px; */
  /* background: #e4e7ed; */
  /* background: #b5e9ff; */
  /* border-radius: 3px; */
  cursor: move;
  user-select: none;
}
.slider .process {
  position: absolute;
  left: 0;
  top: 0;
  width: 112px;
  display: table;
  vertical-align: middle;
  text-align: center;
  /* height: 12px; */
  /* border-radius: 3px; */
  /* background: #409eff; */
  /* background: #00a1eb; */
}
.slider .thunk {
  position: absolute;
  left: 100px;
  top: -7px;
  width: 20px;
  height: 20px;
}
.slider .block {
  transition: 0.2s all;
}
.slider .block i {
  font-size: 25px;
  position: relative;
  left: -3px;
  top: 15px;
  cursor: pointer;
}
.slider .block i svg {
  height: 0.8em;
}
.slider .tips {
  position: absolute;
  left: -7px;
  bottom: 30px;
  min-width: 15px;
  text-align: center;
  padding: 4px 8px;
  background: #000;
  /* border-radius: 5px; */
  height: 24px;
  color: #fff;
}
.slider .tips i {
  position: absolute;
  margin-left: -5px;
  left: 50%;
  bottom: -9px;
  font-size: 16px;
  color: #000;
}
.slider .block:hover {
  transform: scale(1.1);
  opacity: 0.6;
}
</style>