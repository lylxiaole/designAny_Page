<template>
  <div class="topBatBox">

    <template></template>

    <!-- <UserOption class="item" />
    <Language class="item" style="margin-right: 20px;" />
    <ThemePicker class="item" /> -->

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'

// **********************************
@Options({
  components: {}
})
export default class index extends Vue {
  private async openAlarmPage() {
    // let errorFlows = await GetFlowmeterAlarms()
    // ;(this.$refs.flowmeterAlarmsRef as any).openDialog(errorFlows)
    ;(this.$refs.flowmeterAlarmsRef as any).openDialog()
  }
  private get currentUserInfo() {
    if (this.$store.state.system.currentUserInfo) {
      return this.$store.state.system.currentUserInfo
    } else {
      return {}
    }
  }

  private get permission_routes(): any[] {
    return this.cuteRoutes(this.$store.state.system.permission_routes)
  }

  private cuteBackgroundColor(targetRoute) {
    let currentRoutePath = this.$route.path

    if (targetRoute.path === currentRoutePath) {
      return '#83C346'
    } else {
      return ''
    }
  }

  private cuteRoutes(routes) {
    let res = []
    const showingChildren = routes.filter((item) => {
      if (item.hidden) {
        return false
      } else {
        return true
      }
    })

    for (let index = 0; index < showingChildren.length; index++) {
      const element = showingChildren[index]
      if (element.hidden) {
        continue
      }
      if (element.meta && !element.children) {
        res.push(element)
      }
      if (element.children) {
        res = res.concat(this.cuteRoutes(element.children))
      }
    }

    return res
  }

  private linkClick(routePath) {
    this.$router.push({ path: routePath })
  }

  mounted() {
    // this.openAlarmPage()
    // setInterval(() => {
    // this.getNotDealAlarmCountFn()
    // }, 10000)
  }
  destroyed() {}
  // private alaramCount = 0
  // private async getNotDealAlarmCountFn() {
  //   this.alaramCount = await GetNotDealAlarmCount()
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.topBatBox {
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .item {
    // min-width: 75pt;
    height: 30pt;
    line-height: 30pt;
    // float: left;
    color: white;
    cursor: pointer;
    text-align: center;
    float: right;
    color: var(--lyl_topBarText);
  }
  .signOut {
    width: auto;
    margin-right: 30px;
    text-align: left;
  }

  .canChooseItem:hover {
    background-color: #83c346;
    color: white;
  }

  /deep/ .el-badge {
    width: 22px;
    margin-left: 10px;
    margin-right: 10px;
  }

  /deep/ .el-menu--horizontal > .el-submenu .el-submenu__icon-arrow {
    position: absolute;
    right: 0px;
    margin-top: -5px;
  }
  .userLoginInfo {
    img {
      margin-right: 10px;
    }
    vertical-align: middle;
    width: 200px;
    display: flex;
    // justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
  }
}
</style>
