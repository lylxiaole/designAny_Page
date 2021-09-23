<template>
  <div style="overflow-x:hidden;overflow-y:auto">
    <el-radio-group @change="changeActivekey" style="margin-left:30px;margin-top:10px;" v-model="activeKey">
      <a-radio style="width:110px;height:30px;text-align:center;text-overflow:ellipsis;white-space:nowrap;" v-for="group in propertyGroups"
        :key="group.groupName" :value='group.groupName'>
        {{group.groupName}}
      </a-radio>
    </el-radio-group>
    <el-row style="width:100%;height:1px;background:rgba(233,233,233,1);margin-top:10px;"></el-row>
    <div v-show="propIsShow">
      <el-row class="propertyGridRow" style="margin-top:10px;" v-for="propertyInfo in propertyData" v-show="propertyInfo.isShow"
        :key="propertyInfo.name" :disabled="propertyInfo.isEnable==false">
        <el-col :span="8" style="margin-left:16px;font-size:14px;font-weight:400;color:rgba(0,0,0,0.65);line-height:22px;font-size:14px;">
          {{propertyInfo.name}}</el-col>
        <el-col :span="10" style="margin-left:4px">
          <component :is="propertyInfo.comp" :outerProperty.sync="propertyInfo.property" :outerPropertyValue.sync="propertyInfo.property.value"
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



import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { Property, PropertyType, PropertyTypeEnum } from '@src/designEngine'
import { PageBase, LayoutBase } from '@src/designEngine'
import { deepClone, serialize, deserialize } from '@src/utils'
import propertyCellBase from './propertyGridCells/common'

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

/**动态读取propertyGrid Cell组件 */ 
var cellControls: Function[] = []
const modulesFiles = require.context('./propertyGridCells', true, /\.(vue)$/)
modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  if (value.default.$Meta && value.default.$Meta.celltype) {
    cellControls.push(value.default)
  }
  return modules
}, {})

  function getCellControl(propertyType: PropertyTypeEnum): typeof propertyCellBase {
  return cellControls.filter((o) => o.prototype.$Meta.celltype == propertyType)[0] as typeof propertyCellBase
}
// *****************************************

@Component({
  name: 'propertyGrid',
  components: {
    // ColorPicker: myComponents.colorPicker,
    // UploadFile: myComponents.uploadFile,
    // AceEditor: myComponents.aceEditor,
    // DatePicker: myComponents.datePicker
  }
})
export default class PropertyGrid extends Vue {
  private activeKey: string[] = []
  private propertyDataCache: propertyInfo[] = []
  private propIsShow: boolean = false
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

  private get propertyData(): propertyInfo[] {
    if (!this.allowedPropertys) {
      return this.propertyDataCache
    } else {
      return this.propertyDataCache.filter((p) => {
        let findfilter = this.allowedPropertys.find((o) => o.groupName == p.property.groupName && o.propertyName == p.property.propertyName)
        if (findfilter) {
          return true
        } else {
          return false
        }
      })
    }
  }

  @Prop()
  private allowedPropertys: propertyFilterInfo[]
  /**当前的布局页面 */
  @Prop()
  private currentPage: PageBase
  /**当前需要设置的所有布局*/
  @Prop()
  private currentLayouts: LayoutBase[] | LayoutBase
  /**当前所有布局的共有属性列表 */
  private propertyGroups: PropertyGroupInfo[] = []
  /**vue监视不到复杂类型的数据变化，需要用旧的做对比*/
  private propertyGroups_oldClone: PropertyGroupInfo[] = []
  @Watch('currentLayouts') //监视设置的布局变化，并重新计算所有属性
  private watchCurrentLayoutsChanged(newlayouts: LayoutBase[] | LayoutBase) {
    window.console.log('当前布局变更', newlayouts)
    this.isWatchPropertiesChange = false
    this.propertyGroups = []
    this.propertyDataCache = []
    if (!newlayouts || (newlayouts as any[]).length < 1) {
      this.propertyGroups = null
      return
    }
    var property_extra: Property[] = [] //临时变量
    var newlayouts_extra: LayoutBase[] = [] //临时变量

    if (newlayouts instanceof LayoutBase) {
      newlayouts_extra = [newlayouts as LayoutBase]
    } else {
      newlayouts_extra = newlayouts as LayoutBase[]
    }
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
    /**将所有共有属性进行分组 */
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
        propertyinfox.property = deepClone(o)
        propertyinfox.comp = getCellControl(o.propertyType.type)
        findgroup.children.push(propertyinfox)
        if (o.groupName == this.selectGropName) {
          this.propertyDataCache.push(propertyinfox)
        }
      }
    })

    this.propertyDataCache = this.propertyDataCache
    //**初始化clone副本 */
    this.propertyGroups_oldClone = deepClone(this.propertyGroups)
    /** */
    this.isWatchPropertiesChange = true
  }
  @Watch('propertyGroups', { deep: true, immediate: true })
  //监视所有属性变化，并给当前选中的布局赋值
  private watchPropertyGroupsChanged(newgroup: PropertyGroupInfo[]) {
    if (this.isWatchPropertiesChange == false) {
      return
    }
    // window.console.log('属性单元格变化了')
    if (!newgroup) {
      this.propertyGroups_oldClone = []
      return
    }
    // newgroups.filter((newgroup) => {})

    for (var groupIndex = 0; groupIndex < newgroup.length; groupIndex++) {
      var group = newgroup[groupIndex]
      var newProperties = group.children
      var properties_old = this.propertyGroups_oldClone.filter((o) => o.groupName == group.groupName)[0].children
      for (var j = 0; j < newProperties.length; j++) {
        var newproperty = newProperties[j]
        var filter_oldproperty = properties_old.filter((o) => o.property.id == newproperty.property.id)[0]
        if (serialize(filter_oldproperty.property.value) != serialize(newproperty.property.value)) {
          var isok = this.changeLayoutProperty(newproperty.property.propertyName, newproperty.property.groupName, newproperty.property.value)
          if (isok == true) {
            filter_oldproperty.property.value = deepClone(newproperty.property.value)
          } else if (filter_oldproperty.property.value) {
            newproperty.property.value = deepClone(filter_oldproperty.property.value)
          } else {
            newproperty.property.value = filter_oldproperty.property.value
          }
        }
      }
    }
    this.renderStyle()
  }
  /**为了应付多选组件，批量设置属性 */
  private changeLayoutProperty(propertyName: string, propertyGroupName: string, newval: any): boolean {
    var newlayouts_extra: LayoutBase[] = [] //临时变量
    if (this.currentLayouts instanceof LayoutBase) {
      newlayouts_extra = [this.currentLayouts as LayoutBase]
    } else {
      newlayouts_extra = this.currentLayouts as LayoutBase[]
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
  public refreshProperty(property: Property) {
    // window.console.log('refreshProperty')
    this.isWatchPropertiesChange = false
    var propertyService
    /************************************ */
    if (!this.propertyGroups) {
      return
    }
    var findCurrentGroup = this.propertyGroups.filter((o) => o.groupName == property.groupName)[0]
    var findOldGroup = this.propertyGroups_oldClone.filter((o) => o.groupName == property.groupName)[0]

    if (findOldGroup) {
      var findOldProperty = findOldGroup.children.filter((o) => o.property.id == property.id)[0]
      if (findOldProperty && serialize(findOldProperty.property) != serialize(property)) {
        findOldProperty.property = deepClone(property)
        findOldProperty.name = property.propertyName
        findOldProperty.secondGroup = property.secondGroup
      }
    }

    if (findCurrentGroup) {
      var findCurrentProperty = findCurrentGroup.children.filter((o) => o.property.id == property.id)[0]
      if (findCurrentProperty && serialize(findCurrentProperty.property) != serialize(property)) {
        findCurrentProperty.property = deepClone(property)
        findCurrentProperty.name = property.propertyName
        findCurrentProperty.secondGroup = property.secondGroup
      }
    }
    /****************************************** */
    this.isWatchPropertiesChange = true
  }

  mounted() {}

  changeActivekey(e: any) {
    var groupName = e.target.value
    this.selectGropName = e.target.value
    var tempGrop = this.propertyGroups.filter((o) => o.groupName == groupName)[0]

    this.propertyDataCache = tempGrop.children
    this.propIsShow = true
  }

  renderStyle() {
    this.$nextTick(() => {
      var arrow = $(this.$el)
        .find('.ant-collapse-header')
        .find('.arrow')
      $(arrow).css('left', 'initial')
      $(arrow).css('right', '16px')
      var collapseHeader = $(this.$el).find('.ant-collapse-header')
      $(collapseHeader).css('padding-left', '8px')
    })
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