<template>
  <div :style="{position:'relative','width':width+'px','height':height+'px','left':left+'px','top':top+'px' }"
    oncontextmenu="self.event.returnValue=false">

  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { PageBase, ComponentBase, LayoutBase, LayoutInfo } from '../../03designerLayoutBase'
import { getUuid, deepClone } from '@src/utils'
import CompIncrustationPro from './CompIncrustationPro.vue'
import { CurrentContext } from '../../01designerContext'
import { DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'

export default class Layout_Professional extends PageBase {
  get backgroundCute(): string {
    // let property = this.findPropertyByName('基础设置', '背景图片')
    if (!this.background_img || !this.background_img.url) {
      return this.background
    }
    return 'url("' + BuildingFileUrlForShow(CurrentContext.FileServerAddress, this.background_img.url) + '")'
  }

  // ***********文件上传相关*******************
  private uploadFileList: any[] = []
  private upLoadSize: number = 10
  private maxFileLength: number = 1
  private domCache: DocumentFragment = null
  private tickTimerObj: any
  //页面中包含的布局容器
  public PageComponentIncrustations: CompIncrustationPro[] = []

  private _loadTimeTick() {
    if (this.IsDesigning) {
      return
    }

    if (!this.tickTime || this.tickTime < 1) {
      return
    }

    let event = this.designerEvents.find((o) => o.eventName == '定时器触发事件')
    if (event && !this.tickTimerObj) {
      // window.console.log('创建定时器')
      this.tickTimerObj = window.setInterval(() => {
        this.triggeEvent('定时器触发事件', null)
      }, this.tickTime * 1000)
    }
  }

  private _destroyTimeTick() {
    // window.console.log('销毁定时器', this.tickTimerObj)
    if (this.tickTimerObj) {
      window.clearInterval(this.tickTimerObj)
      this.tickTimerObj = null
    }
  }

  created() {
    this.registerEvents('页面激活', '页面激活时触发', [], null)
    this.registerEvents('页面消息传递', '由部分应用触发', [], null)
    // this.$bus.$on('on_wsmsg', this.onWSmessage)
  }

  mounted() {
    // this.domCache = window.document.createDocumentFragment()
    // this.$once('pageReadyToDraw', () => {
    //   $(this.$el).append(this.domCache)
    //   this.domCache = null
    // })
    // this.onSave_Event = (e) => {
    //   if (this.IsDesigning) {
    //     this.Save()
    //     this.$message.success('页面已保存', 2)
    //   }
    // }
  }

  beforeDestroy() {
    // //window.console.log('销毁页面消息监听')
    // this.$bus.$off('on_wsmsg', this.onWSmessage)
    // //window.console.log('删除文件上传组件')
    // if (this.$refs['papapapsjjadhfkhasdgfkhasgdf']) {
    //   ;(this.$refs['papapapsjjadhfkhasdgfkhasgdf'] as any).$destroy()
    //   ;(this.$refs['423b1336-510f-4497-9761-d0bb8f3d4ef9'] as any).$destroy()
    // }
    this._destroyTimeTick()
  }

  private onWSmessage(data: any) {
    //window.console.log('**********页面来消息啦', data)
    this.triggeEvent('页面消息传递', data)
  }

  // *******************************public**************************************************************************************
  protected renderComponent(compCon: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum): LayoutBase {
    // let tmpNode = window.document.createElement('div')
    // if (this.domCache) {
    //   this.domCache.appendChild(tmpNode)
    // } else {
    //   $(this.$el).append(tmpNode)
    // }
    // /**实例化组件壳子 */
    // let compIn = new CompIncrustationPro()
    // compIn.$mount(tmpNode)
    // compIn.$forceUpdate()
    // if (this.IsDesigning == true) {
    //   this._dragHelper.makeDomCanDrag(compIn.$el)
    // }
    // /**在组件壳子中添加组件 */
    // compCon.parentPage = this
    // compIn.AddComponent(compCon)
    // this.PageComponentIncrustations.push(compIn)
    return compCon
  }

  // *******************************overrides**************************************************************************************
  public deleteChildComponents(compId: string): boolean {
    let find = this.PageComponentIncrustations.find((o) => o.InnerComponent.Id == compId)
    if (find) {
      let index = this.PageComponentIncrustations.indexOf(find)
      this.PageComponentIncrustations.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}
</script>