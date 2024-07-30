import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { VNode } from 'vue'
import { groupNode, actionObj, objectType, object_Variable, object_FixedVal } from '@designEngine/index'

@Options({})
export default class bahaviorResourceSelectTree extends Vue {
  @Prop() currentObj: actionObj
  @Prop() resourceTypesNotAllow: string[]
  @Prop() canDeleteObj: boolean

  // private myEventId: string = getUuid()
  private renderContext: any = null
  private selectedKeys: string[] = []
  private normalResources: groupNode[] = []
  private signResources: actionObj[] = []

  private get resourceTypeNotAllow(): string[] {
    if (!this.resourceTypesNotAllow) {
      return []
    }
    return this.resourceTypesNotAllow
  }
  created() {}

  mounted() {
    this.onRefreshResource()
    // actionResources.onRefreshResource(this.myEventId, this.onRefreshResource)
  }
  beforeUnmount() {
    // actionResources.removeOnRefreshResource(this.myEventId)
  }
  private onRefreshResource() {
    // this.normalResources = actionResources.objectResources.filter((o) => o.title != '运算符')
    // this.signResources = actionResources.objectResources.filter((o) => o.title == '运算符')[0].childrenObjs
  }
  /*********绘制控件节点************************ */
  protected render(h: any) {
    this.renderContext = h
    if (!this.currentObj) {
      return <div></div>
    }
    // window.console.log('正在绘制公式资源列表',this.getCurrentReousources())
    if (this.currentObj.objType == objectType.fixedVal) {
      return (
        <a-dropdown>
          <a-badge>
            {this.cuteDeleteIcon(h)}
            <a-input style="width:250px" onClick={() => this.onFocus(this.currentObj)} class="ant-dropdown-link" v-model={(this.currentObj as object_FixedVal).val} placeholder="请填写固定值" />
          </a-badge>
          <a-menu style="height:300px;width:250px;overflow:auto" slot="overlay" onSelect={this.menuSelected.bind(this)} v-model={this.selectedKeys} selectable>
            {this.cuteGroupOptions(this.renderContext, this.normalResources)}
          </a-menu>
        </a-dropdown>
      )
    } else if (this.currentObj.objType == objectType.variable) {
      return (
        <a-dropdown>
          <a-badge>
            {this.cuteDeleteIcon(h)}
            <a-input style="width:250px" onClick={() => this.onFocus(this.currentObj)} class="ant-dropdown-link" v-model={(this.currentObj as object_Variable).name} placeholder="请填写变量名称" />
          </a-badge>
          <a-menu style="height:300px;width:250px;overflow:auto" slot="overlay" onSelect={this.menuSelected.bind(this)} v-model={this.selectedKeys} selectable>
            {this.cuteGroupOptions(this.renderContext, this.normalResources)}
          </a-menu>
        </a-dropdown>
      )
    } else if (this.currentObj.objType == objectType.method) {
      return (
        <a-dropdown>
          <a-badge>
            {this.cuteDeleteIcon(h)}
            <a-button onClick={() => this.onFocus(this.currentObj)} style="margin: 0px,8px" class="ant-dropdown-link">
              {this.currentObj == null ? <span>请选择</span> : <span>{this.currentObj.name}</span>}
              <a-icon type="down" />
            </a-button>
          </a-badge>
          <a-menu style="height:300px;width:250px;overflow:auto" slot="overlay" onSelect={this.menuSelected.bind(this)} v-model={this.selectedKeys} selectable>
            {this.cuteGroupOptions(this.renderContext, this.normalResources)}
          </a-menu>
        </a-dropdown>
      )
    } else if (this.currentObj.objType == objectType.signs) {
      return (
        <a-dropdown>
          <a-badge>
            {this.cuteDeleteIcon(h)}
            <a-button onClick={() => this.onFocus(this.currentObj)} style="margin: 0px,8px" class="ant-dropdown-link">
              {this.currentObj == null ? <span>请选择</span> : <span>{this.currentObj.name}</span>}
              <a-icon type="down" />
            </a-button>
          </a-badge>
          <a-menu style="height:300px;width:250px;overflow:auto" slot="overlay" onSelect={this.menuSelected.bind(this)} v-model={this.selectedKeys} selectable>
            {this.cuteObjectOptions(this.renderContext, this.signResources)}
          </a-menu>
        </a-dropdown>
      )
    }
  }

  private cuteDeleteIcon(h: any): VNode {
    if (this.canDeleteObj) {
      return <a-icon slot="count" onClick={() => this.onDelete(this.currentObj)} type="delete" style="color: #f5222d;cursor:pointer" />
    }
  }
  private cuteGroupOptions(h: any, nodes: groupNode[]): VNode[] {
    if (!nodes) {
      return []
    }

    var domVNodes: VNode[] = []
    nodes.filter((node) => {
      let newnode = (
        <a-sub-menu style="width:250px;overflow:hideen; white-space:nowrap; text-overflow:ellipsis" title={node.title}>
          {this.cuteObjectOptions(this.renderContext, node.childrenObjs)}
          {this.cuteGroupOptions(this.renderContext, node.childrenGroups)}
        </a-sub-menu>
      )
      domVNodes.push(newnode)
    })
    return domVNodes
  }

  private cuteObjectOptions(h: any, objs: actionObj[]): VNode[] {
    if (!objs) {
      return []
    }
    var domVNodes: VNode[] = []
    objs.filter((obj) => {
      if (this.resourceTypeNotAllow.indexOf(obj.funcCode) < 0) {
        let newnode = (
          <a-menu-item style="width:250px;overflow:hideen; white-space:nowrap; text-overflow:ellipsis" value={obj.resourceId} key={obj.resourceId}>
            {obj.name}
          </a-menu-item>
        )
        domVNodes.push(newnode)
      }
    })
    return domVNodes
  }
  /*********计算数据节点************************ */
  private getSelectedObj(id: string, groups: groupNode[]): actionObj {
    for (let index = 0; index < groups.length; index++) {
      let group = groups[index]
      if (group.childrenObjs) {
        let findObj = group.childrenObjs.find((o) => o.resourceId == id)
        if (findObj) {
          return findObj
        }
      }
      if (group.childrenGroups) {
        let findObj = this.getSelectedObj(id, group.childrenGroups)
        if (findObj) {
          return findObj
        }
      }
    }
    return null
  }

  private menuSelected({ item, key, selectedKeys }: any) {
    if (selectedKeys.length < 1) {
      this.onSelectNodeChanged(null, this.currentObj)
      return
    }
    var currentnode = this.getSelectedObj(key, this.normalResources)
    if (!currentnode) {
      currentnode = this.signResources.find((o) => o.resourceId == key)
    }
    this.onSelectNodeChanged(currentnode, this.currentObj)
  }
  // ********对外事件**********************************************************
  @Emit('onSelectNodeChanged')
  private onSelectNodeChanged(newObj: actionObj, oldObj: actionObj) {}
  @Emit('onFocus')
  private onFocus(obj: actionObj) {}
  @Emit('onDelete')
  private onDelete(obj: actionObj) {}
}
