import { Options, Vue } from 'vue-class-component'

import { DPageAttr } from '@design-any/interface/dist/LayoutAttr/PageInfo'
import { EnginePage, EngineLayout, EngineComponent } from '@design-any/interface/dist/LayoutInterface'
import platform from '@design-any/interface/dist/enums/platform'

import ViewShell from './ViewShell.vue'
import { designDrawDomVirtual } from '@design-any/interface/dist/utils/drawVueDom'
import applicationContext from '../01designerContext/context'

@Options({})
export default class ViewPageBase extends EnginePage {
  private get backgroundCute(): string {
    if (!this.background_img || this.background_img.length < 1) {
      return this.background
    }
    return 'url("' + this.applicationContext.getFileApiAddr(this.background_img[0].uid) + '")'
  }
  public allShells: ViewShell[] = []

  created() {}
  mounted() {}

  protected override async renderComponent(compCon: EngineComponent): Promise<EngineLayout> {
    let { virtualDom, vueComp } = designDrawDomVirtual(ViewShell, false, { applicationContext: applicationContext })
    // this._dragHelper.makeDomCanDrag(shell.$el)
    this.allShells.push(vueComp as ViewShell)
    let resComp = (vueComp as ViewShell).addComponent(compCon)
    resComp.$once('onLYLDestroyed', () => {
      let findIndex = this.allShells.findIndex((o) => o == vueComp)
      this.allShells.splice(findIndex, 1)
      ;(vueComp as ViewShell).destorymethod()
    })
    // ;(vueComp as ViewShell).startListenItemDrag()
    $(this.$el).append(virtualDom)
    return resComp
  }
}
