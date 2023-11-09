<template>
  <div class="resource-tree" :style="{height:'100%'}">
    <div :style="{padding:'0px 3px',width:itemWidth?itemWidth:'200px'}">
      <a-input-search v-if="canSearch" v-model="currentSearchStr" size="middle" style="margin-bottom: 8px" @search="onSearch" />
      <div :style="{height:canSearch?'460px':'500px',overflow:'auto'}" @scroll="onTreeScroll">
        <a-menu :style="{width:'100%',overflow:'auto',height:'100%'}" @select="onSelectItem">
          <template v-for="item in currentItems">
            <a-menu-item v-if="item.key" size="small" :tooltip="item.title" :key="item.key">
              <a-tooltip :title="item.title">
                <a-icon type="folder" />{{item.title}}
              </a-tooltip>
            </a-menu-item>
            <a-menu-item v-else size="small" :tooltip="item.name" :key="item.id">
              <a-tooltip :title="item.name">
                <a-icon type="tag" />{{item.name}}
              </a-tooltip>
            </a-menu-item>
          </template>
        </a-menu>
      </div>
    </div>
    <resouce-choose-comp v-if="isShowNextList" itemWidth="300px" ref="resourceTree" @onSelectedObj="onSelectedObj"
      :canSearch="currentSelectNode.canSearch" :canScrollPage="currentSelectNode.canScrollPage" :parentGroup="currentSelectNode" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
 
import { groupNode, objectBase, objectType, object_Variable, object_FixedVal, resourceType, resourceSearchType } from '@designEngine/03designerLayoutBase/index'
import { getSearchClass } from '@designEngine/index'

@Options({ name: 'resouceChooseComp' })
export default class resouceChooseComp extends Vue {
  @Prop() parentGroup: groupNode
  @Prop() itemWidth: any

  @Watch('parentGroup', { deep: true, immediate: true })
  private watchParentGroupChanges(val: groupNode) {
    this.refreshCurrentItems()
  }

  @Prop() canSearch: boolean
  @Prop() canScrollPage: boolean

  private currentItems: (groupNode | objectBase)[] = []

  public async refreshCurrentItems() {
    // window.console.log('刷新资源数据了')
    var res = []
    if (!this.parentGroup) {
      var allReourceTypes = [
        resourceSearchType.fixedVal,
        resourceSearchType.variables,
        resourceSearchType.behaviorInParam,
        resourceSearchType.pageContext,
        resourceSearchType.workflows,
        resourceSearchType.customFunctions,
        resourceSearchType.systemDict,
        resourceSearchType.fileTemplate,
        resourceSearchType.localStorage,
        resourceSearchType.models,
        resourceSearchType.controlsInPage,
        resourceSearchType.pageSources,
        resourceSearchType.normalPopupWindow,
        resourceSearchType.pagePopupWindow,
        resourceSearchType.pageRoute,
        resourceSearchType.externalLinks,
        resourceSearchType.modelMapper,
        resourceSearchType.consoleSettings
      ]

      for (let index = 0; index < allReourceTypes.length; index++) {
        const o = allReourceTypes[index]
        if (!getSearchClass(o)) {
          continue
        }
        var findsearchclass = getSearchClass(o)
        if (findsearchclass.currentGroup && findsearchclass.isNeedCache == true) {
          res.push(findsearchclass.currentGroup)
        } else {
          getSearchClass(o).clear()
          res.push(await getSearchClass(o).searchNext())
        }
      }
    } else {
      if (this.parentGroup.childrenObjs && this.parentGroup.childrenObjs.length > 0) {
        res = this.parentGroup.childrenObjs
      }
      if (this.parentGroup.childrenGroups && this.parentGroup.childrenGroups.length > 0) {
        res = res.concat(this.parentGroup.childrenGroups)
      }
    }
    // window.console.log('刷新当前节点', res)
    this.currentItems = res
  }

  private currentSelectKeys: string[] = []
  private currentSearchStr: string = ''

  private get currentSelectNode(): groupNode | objectBase {
    if (this.currentSelectKeys.length < 1) {
      return null
    }
    let key = this.currentSelectKeys[0]
    var res = null
    this.currentItems.filter((item) => {
      if ((item as any).key == key || (item as any).id == key) {
        res = item
      }
    })
    // window.console.log('当前选择的节点变化', res)
    return res
  }
  private get isShowNextList(): boolean {
    if (!this.currentSelectNode) {
      return false
    }
    if ((this.currentSelectNode as any).id) {
      return false
    }
    return true
  }
  private get nextListItems(): (groupNode | objectBase)[] {
    var group = this.currentSelectNode as groupNode
    if (group.childrenObjs && group.childrenObjs.length > 0) {
      return group.childrenObjs
    } else {
      return group.childrenGroups
    }
  }
  /*************************************************************************** */
  mounted() {}
  /*************************************************************************** */
  /**选择树节点 */
  private onSelectItem(selecteditem: any) {
    this.currentSelectKeys = []
    // window.console.log('选择了节点')
    if (!selecteditem) {
      this.onSelectedObj(null)
      return
    }
    let key = selecteditem.key
    this.currentSelectKeys = [key]
    //
    let res = null
    this.currentItems.filter((item) => {
      if ((item as any).id == key || (item as any).key == key) {
        res = item
      }
    })

    if (res.id) {
      this.onSelectedObj(res as objectBase)
    } else {
      this.onSelectedObj(null)
    }
    /** */
    // var resourceTree = this.$refs['resourceTree'] as any
    // resourceTree.refreshCurrentItems()
  }
  /**树下拉 */
  private async onTreeScroll(e: any) {
    var winH = $(e.target).height() //页面可视区域高度
    var pageH = $(e.target).children().height() //当前文档总高度
    var scrollT = $(e.target).scrollTop() //滚动条top的值
    var bottomH = (pageH - winH - scrollT) / winH // 当前所滚动位置到底部距离
    if (bottomH > 0) {
      //还未滚动到底部
      return
    }

    if (!this.canScrollPage) {
      return
    }
    if (!this.parentGroup) {
      return
    }

    var searchClass = getSearchClass(this.parentGroup.resourceSearchType)
    if (searchClass.canScroll) {
      var newdata = await searchClass.searchNext()
      e.target.scrollTop = scrollT - 10
      this.parentGroup.childrenGroups = newdata.childrenGroups
      this.parentGroup.childrenObjs = newdata.childrenObjs
      this.refreshCurrentItems()
    }
  }

  private async onSearch(value: any) {
    // window.console.log('开始搜索', value)
    var newdata: groupNode = null
    if (value && value.length > 0) {
      newdata = await getSearchClass(this.parentGroup.resourceSearchType).searchStr(value)
    } else {
      newdata = await getSearchClass(this.parentGroup.resourceSearchType).searchStr()
    }

    this.parentGroup.childrenGroups = newdata.childrenGroups
    this.parentGroup.childrenObjs = newdata.childrenObjs
    this.refreshCurrentItems()
  }

  @Emit('onSelectedObj')
  private onSelectedObj(obj: objectBase) {}
}
</script>

<style lang="less" scoped>
 
.ant-list-split .ant-list-item {
  border-bottom: none;
}

.resource-tree {
  display: flex;
  flex-wrap: nowrap;
  justify-content: left;
  // justify-content: center;
  // align-items: center;
}

.ant-menu-item:hover,
.ant-menu-item-active,
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-submenu-active,
.ant-menu-submenu-title:hover {
  color: #000;
}
</style>
 