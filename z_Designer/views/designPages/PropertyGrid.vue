<template>
  <div style="overflow:hidden">
    <el-radio-group @change="changeActivekey" v-model="selectGropName" size="small"
      style="margin-left:30px;margin-top:10px;box-sizing:border-box;height:35px">
      <el-radio-button v-for="group in propertyGroups" :key="group.groupName" :label="group.groupName"
        style="width:110px;height:30px;text-align:center;text-overflow:ellipsis;white-space:nowrap;">
      </el-radio-button>
    </el-radio-group>
    <!-- ******************************** -->
    <el-row style="width:100%;height:1px;background:rgba(233,233,233,1);margin-top:10px;box-sizing:border-box"></el-row>
    <!-- ************************************* -->
    <div style="width:100%;height:calc(100% - 56px);overflow-y:auto;box-sizing:border-box;margin-bottom:10px">
      <el-row class="propertyGridRow" style="margin-top:10px;" v-for="propertyInfo in propertyDataCache" v-show="propertyInfo.isShow"
        :key="propertyInfo.name" :disabled="propertyInfo.isEnable==false">
        <el-col :span="8" style="margin-left:16px;font-size:14px;font-weight:400;color:rgba(0,0,0,0.65);line-height:22px;font-size:14px;">
          {{propertyInfo.name}}</el-col>
        <el-col :span="10" style="margin-left:4px">
          <!-- <component :is="propertyInfo.comp" :outerProperty.sync="propertyInfo.property" :outerPropertyValue.sync="propertyInfo.property.value"
            :currentPage="currentPage" :currentLayouts="currentLayouts" @selectDict="selectDict">
          </component> -->
          <component :is="propertyInfo.comp" :outerProperty="propertyInfo.property" v-model:outerPropertyValue="propertyInfo.property.value"
            :currentPage="currentPage" :currentLayouts="currentLayouts" @selectDict="selectDict">
          </component>
        </el-col>
        <el-col :span="4">
          <span>{{propertyInfo.property.propertyType.unit}}</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import { Property, PropertyType, PropertyTypeEnum } from '@designEngine/03designerLayoutBase'
import { EnginePage, EngineLayout } from '@designEngine/03designerLayoutBase'
import { deepClone, serialize, deserialize } from '@common/utils'
import propertyCellBase, { cellControls } from './propertyGridCells/common'

class PropertyGroupInfo {
  groupName: string
  children: propertyInfo[] = []
}
class propertyInfo {
  name: string
  secondGroup: string

  get isShow(): boolean {
    if (this.property.canSetting == false) {
      return false
    }
    return true
  }

  get isEnable(): boolean {
    if (this.property.canSetting == false) {
      return false
    }
    return true
  }
  property: Property

  comp: typeof propertyCellBase
}
class propertyFilterInfo {
  groupName: string
  propertyName: string
}
/**加载所有propertyGrid Cell组件 */
const modulesFiles = require.context('./propertyGridCells', true, /\.(vue)$/)
modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  return modules
}, {})

function getCellControl(propertyType: PropertyTypeEnum): typeof propertyCellBase {
  return cellControls.filter((o) => o.prototype.$Meta.celltype == propertyType)[0] as typeof propertyCellBase
}
// *****************************************

@Options({
  name: 'propertyGrid',
  components: {}
})
export default class PropertyGrid extends Vue {
  private selectGropName: string = ''
  private columns = [
    {
      title: '属性名',
      dataIndex: 'propertyName'
    },
    {
      title: '属性值',
      className: 'propertyVal'
    }
  ]

  private isWatchPropertiesChange: boolean = true
  private propertyDataCache: propertyInfo[] = []

  @Watch('propertyDataCache', { deep: true })
  private watchPropertyDataCacheChanged(newproperties: propertyInfo[], oldproperties: propertyInfo[]) {
    if (this.isWatchPropertiesChange == false) {
      return
    }

    window.console.log('propertyDataCache changed:')
    for (let index = 0; index < newproperties.length; index++) {
      const nproperty = newproperties[index]
      this.changeLayoutProperty(nproperty.property.propertyName, nproperty.property.groupName, nproperty.property.value)
    }
  }

  /**当前的布局页面 */
  @Prop()
  public currentPage: EnginePage
  /**当前需要设置的所有布局*/

  /**当前所有布局的共有属性列表 */
  private propertyGroups: PropertyGroupInfo[] = []
  @Watch('propertyGroups', { deep: true, immediate: true })
  //监视所有属性变化，并给当前选中的布局赋值
  private watchPropertyGroupsChanged(newgroup: PropertyGroupInfo[]) {
    if (this.isWatchPropertiesChange == false) {
      return
    }

    if (!this.selectGropName) {
      let firstGroup = newgroup[0]
      if (firstGroup) {
        this.changeActivekey(firstGroup.groupName)
      }
    } else {
      let find = newgroup.find((o) => o.groupName === this.selectGropName)
      if (!find) {
        let firstGroup = newgroup[0]
        if (firstGroup) {
          this.changeActivekey(firstGroup.groupName)
        }
      }
    }
  }
  @Prop()
  private currentLayouts: EngineLayout[] | EngineLayout
  @Watch('currentLayouts') //监视设置的布局变化，并重新计算所有属性
  private watchCurrentLayoutsChanged(newlayouts: EngineLayout[] | EngineLayout) {
    window.console.log('当前布局变更', newlayouts)
    this.isWatchPropertiesChange = false
    this.propertyGroups = []
    this.propertyDataCache = []
    if (!newlayouts || (newlayouts as any[]).length < 1) {
      this.propertyGroups = null
      return
    }
    //当前选中的Layouts
    var newlayouts_extra: EngineLayout[] = [] //临时变量
    if (newlayouts instanceof EngineLayout) {
      newlayouts_extra = [newlayouts as EngineLayout]
    } else {
      newlayouts_extra = newlayouts as EngineLayout[]
    }
    //当前选中的Layouts的properties
    var property_extra: Property[] = [] //临时变量
    /**用第一个布局的属性列表当作临时属性列表 */
    if (newlayouts_extra.length > 0) {
      property_extra = [...newlayouts_extra[0].properties]
    }
    /**找出所有布局容器中公有的属性 */
    for (var i = 0; i < newlayouts_extra.length; i++) {
      var findlayout = newlayouts_extra[i]
      property_extra.filter((o) => {
        var findproperty = findlayout.properties.filter((p) => p.groupName == o.groupName && p.propertyName == o.propertyName)[0]
        if (!findproperty) {
          property_extra.splice(property_extra.indexOf(o), 1)
        }
      })
    }
    // window.console.log('watchCurrentLayoutsChanged-2:', property_extra)
    /**将所有共有属性进行分组，同时筛选出所有的属性信息 */
    property_extra.filter((o) => {
      if (o.propertyType) {
        var findgroup = this.propertyGroups.find((p) => p.groupName == o.groupName)
        if (!findgroup) {
          findgroup = new PropertyGroupInfo()
          if (o.groupName !== '主题') {
            findgroup.groupName = o.groupName
            this.propertyGroups.push(findgroup)
          }
        }
        var propertyinfox = new propertyInfo()
        propertyinfox.name = o.propertyName
        propertyinfox.secondGroup = o.secondGroup
        propertyinfox.property = o
        // propertyinfox.property = deepClone(o)
        propertyinfox.comp = getCellControl(o.propertyType.type)
        findgroup.children.push(propertyinfox)
        if (o.groupName == this.selectGropName) {
          this.propertyDataCache.push(propertyinfox)
        }
      }
    })

    /** */
    this.isWatchPropertiesChange = true
  }

  mounted() {}

  @Emit('selectDict')
  private selectDict() {
    //window.console.info('进入右侧折叠面板')
  }
  @Emit('selectDicted')
  public selectDicted(param) {
    //window.console.info('currentLayouts----------', this.currentLayouts[0].properties)
    var property = this.currentLayouts[0].properties.filter((o) => o.propertyName == '选择枚举')[0]
    property.value = param
    //window.console.info('aa-------------------aaaa', property)
  }

  changeActivekey(groupname: string) {
    let groupName = groupname
    this.selectGropName = groupname
    let tempGrop = this.propertyGroups.filter((o) => o.groupName == groupName)[0]
    this.propertyDataCache = tempGrop.children
  }

  /**为了应付多选组件，批量设置属性 */
  private changeLayoutProperty(propertyName: string, propertyGroupName: string, newval: any): boolean {
    var newlayouts_extra: EngineLayout[] = [] //临时变量
    if (this.currentLayouts instanceof EngineLayout) {
      newlayouts_extra = [this.currentLayouts as EngineLayout]
    } else {
      newlayouts_extra = this.currentLayouts as EngineLayout[]
    }

    for (var i = 0; i < newlayouts_extra.length; i++) {
      let layout = newlayouts_extra[0]
      var findproperty = layout.findProperties(propertyGroupName, propertyName)[0]
      var isok = layout.validatorPropertyValue(findproperty.id, newval)
      if (isok == false) {
        return false
      }
    }

    newlayouts_extra.filter((layout) => {
      var findproperty = layout.findProperties(propertyGroupName, propertyName)[0]
      layout.setPropertyVal(findproperty.id, newval)
    })
    return true
  }
}
</script>



<style scoped>
.propertyGridRow {
  margin: 5px 0px;
}
.ant-radio-button-wrapper-checked {
  z-index: 1;
  color: rgba(24, 174, 183, 1);
  background: rgba(24, 174, 183, 0.1);
  /* border-color: #1890ff; */
  -webkit-box-shadow: -1px 0 0 0 #1890ff;
  box-shadow: -1px 0 0 0 #1890ff;
  border-radius: 2px 0px 0px 2px;
  border: 1px solid rgba(24, 174, 183, 1);
}
</style>