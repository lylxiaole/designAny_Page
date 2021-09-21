import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'

import { Property, Text_Property, Behavior_Property, Enum_Property, PropertyGroupName, BindingModels_Property } from '../../02common/commonClasses/LayoutProperty'

import { AllComponents, ComponentBase } from '../'
import { param } from '../../03designerLayoutBase/commonClasses/layoutEvent'
import { columnInfo, tableStyle } from '../table/tableCommonTypes'

@Component({
  name: 'tablemix'
})
@Component
export default class TransferComponent extends ComponentBase {
  traTitles: string[] = ['源标题', '目标标题']
  operations: string[] = ['', ''] //> 或 < 后面的文字信息
  targetKeys: string[] = [] //已经移动到右边的数据
  selectedKeys: string[] = [] //默认选中的项
  //mockData: any[] = []; //数据源
  hasFooter: string = 'footer'
  //懒加载      lazy
  //穿梭框可用性 traDisabled
  //搜索框 showSearch
  inparam: param[]

  //穿梭框表格
  @Prop() dataSource: any[]
  @Prop() currentStyle: tableStyle

  private currentRender: any = null
  private tableColumns: columnInfo[] = []

  public render(h: any) {
    window.console.log('********************* 重新绘制了')
    this.currentRender = h
    const customLabel = (
      <span class="custom-item">
        {h.title} - {h.description}
      </span>
    )

    return {
      label: customLabel, // for displayed item
      value: h.title // for title and filter matching
    }
  }
  //

  inti() {
    for (let i = 0; i < 20; i++) {
      this.dataSource.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        disabled: i % 3 < 1
      })
    }

    const oriTargetKeys = this.dataSource.filter((item) => +item.key % 3 > 1).map((item) => item.key)

    window.console.log('目标数据源: ', oriTargetKeys)

    this.targetKeys = oriTargetKeys
    this.selectedKeys = ['1', '4']
    this.traDisabled = false
  }

  created() {
    this.inti()
  }

  mounted() {
    this.RegisterProperty('是否可点', PropertyGroupName.special, new Enum_Property(true, ['是', '否']), '是')
    this.RegisterProperty('源标题', PropertyGroupName.special, new Text_Property(), '源标题')
    this.RegisterProperty('目标标题', PropertyGroupName.special, new Text_Property(), '目标标题')

    this.RegisterProperty('向右指示文字', PropertyGroupName.special, new Text_Property(), '')
    this.RegisterProperty('向左指示文字', PropertyGroupName.special, new Text_Property(), '')
    this.RegisterProperty('启用搜索', PropertyGroupName.special, new Enum_Property(true, ['是', '否']), '否')

    this.RegisterProperty('懒加载', PropertyGroupName.special, new Enum_Property(true, ['是', '否']), '否')
    //this.RegisterProperty('穿梭框样式', PropertyGroupName.special, new Text_Property(),  '');
    this.RegisterProperty('重新加载', PropertyGroupName.special, new Enum_Property(true, ['是', '否']), '否')

    this.RegisterProperty('穿梭框数据源', PropertyGroupName.special, new BindingModels_Property(), [], false, true)

    //属性改变触发

    this.RegisterMethods('加载数据方法', '', this.refreshData, this.inparam, null)
  }

  //对外接口：获取最新数据
  refreshData(inputDatas: any[]): void {
    this.FindProperties(PropertyGroupName.special, '数据源')[0].value = inputDatas
  }

  //获取数据源==============================================================
  get MockData(): any[] {
    // let datas = CurrentApis.GetTreeSelectData()
    let datas = null
    this.FindProperties(PropertyGroupName.special, '数据源')[0].value = datas
    return datas
  }

  //穿梭框可可用性============================================================
  get traDisabled(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '是否可点')[0]) {
      return (this.FindProperties(PropertyGroupName.special, '是否可点')[0].value as string) == '是' ? false : true
    }
    return false
  }

  set traDisabled(zhi: boolean) {
    window.console.log('可点击性: ', zhi)
  }

  //穿梭框左边标题============================================================
  get leftTilte(): string {
    if (this.FindPropertyByName('特有属性', '源标题')) {
      return this.FindPropertyByName('特有属性', '源标题').value as string
    } else {
      return '暂无数据'
    }
  }

  set leftTilte(zhi: string) {
    window.console.log('源标题: ', zhi)
  }

  @Watch('leftTilte')
  watchLeftTilte() {
    this.SetLeftTitle(this.leftTilte)
  }

  SetLeftTitle(newVal: string) {
    var oldRight = this.traTitles[1]
    this.traTitles = [newVal, oldRight]
  }

  //穿梭框右边标题============================================================
  get rightTilte(): string {
    if (this.FindPropertyByName('特有属性', '目标标题')) {
      return this.FindPropertyByName('特有属性', '目标标题').value as string
    } else {
      return '暂无数据'
    }
  }

  set rightTilte(zhi: string) {
    window.console.log('目标标题: ', zhi)
  }

  @Watch('rightTilte')
  watchRightTilte() {
    this.SetRightTitle(this.rightTilte)
  }

  SetRightTitle(newVal: string) {
    var oldRight = this.traTitles[0]
    this.traTitles = [oldRight, newVal]
  }

  //向右指示文字============================================================
  get operationsRight(): string {
    if (this.FindPropertyByName('特有属性', '向右指示文字')) {
      return this.FindPropertyByName('特有属性', '向右指示文字').value as string
    } else {
      return '暂无数据'
    }
  }

  set operationsRight(zhi: string) {
    window.console.log('向右指示文字: ', zhi)
  }

  @Watch('operationsRight')
  watchOperationsRight() {
    this.SetOperationsRight(this.operationsRight)
  }

  SetOperationsRight(newVal: string) {
    var oldRight = this.operations[1]
    this.operations = [newVal, oldRight]
  }

  //向左指示文字============================================================
  get operationsLeft(): string {
    if (this.FindPropertyByName('特有属性', '向左指示文字')) {
      return this.FindPropertyByName('特有属性', '向左指示文字').value as string
    } else {
      return '暂无数据'
    }
  }

  set operationsLeft(zhi: string) {
    window.console.log('向左指示文字: ', zhi)
  }

  @Watch('operationsLeft')
  watchOperationsLeft() {
    this.SetOperationsLeft(this.operationsLeft)
  }

  SetOperationsLeft(newVal: string) {
    var oldLeft = this.operations[1]
    this.operations = [oldLeft, newVal]
  }

  //启用搜索============================================================
  get showSearch(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '启用搜索')[0]) {
      return (this.FindProperties(PropertyGroupName.special, '启用搜索')[0].value as string) == '是' ? true : false
    }
    return false
  }

  set showSearch(zhi: boolean) {
    window.console.log('启用搜索: ', zhi)
  }

  //懒加载============================================================
  get lazy(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '懒加载')[0]) {
      return (this.FindProperties(PropertyGroupName.special, '懒加载')[0].value as string) == '是' ? true : false
    }
    return false
  }

  set lazy(zhi: boolean) {
    window.console.log('懒加载: ', zhi)
  }

  //穿梭框样式============================================================
  // get listStyle(): any {
  //    if (this.FindPropertyByName('特有属性', '穿梭框样式')) {
  //     var sdg ={  width:this.width,       height:this.height    };
  //     return sdg
  // } else {
  //    return null
  //  }
  //}

  //set listStyle(zhi:any){
  //  console.log("穿梭框样式: ", zhi);
  //}

  //重新加载============================================================
  get dispalyFooter(): boolean {
    if (this.FindProperties(PropertyGroupName.special, '重新加载')[0]) {
      return (this.FindProperties(PropertyGroupName.special, '重新加载')[0].value as string) == '是' ? true : false
    }
    return false
  }

  set dispalyFooter(zhi: boolean) {
    window.console.log('重新加载: ', zhi)
  }

  @Watch('dispalyFooter')
  watchDispalyFooter() {
    this.SetDispalyFooter(this.dispalyFooter)
  }

  SetDispalyFooter(newVal: boolean) {
    if (newVal == true) this.hasFooter = 'footer'
    else this.hasFooter = ''
  }

  private handleSelectChange(sourceSelectedKeys: any, targetSelectedKeys: any) {
    this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]

    window.console.log('sourceSelectedKeys: ', sourceSelectedKeys)
    window.console.log('targetSelectedKeys: ', targetSelectedKeys)
  }

  private handleScroll(direction: any, e: any) {
    window.console.log('direction:', direction)
    window.console.log('target:', e.target)
  }

  private handleChange(nextTargetKeys: any, direction: any, moveKeys: any) {
    this.targetKeys = nextTargetKeys
    window.console.log('targetKeys: ', nextTargetKeys)
  }

  private filterOption(inputValue: any, option: any) {
    window.console.log('search开始')
    return option.description.indexOf(inputValue) > -1
  }

  private handleSearch(dir: any, value: any) {
    //value里有搜索结果
    //console.log('search:', value);
  }

  private getMockReload() {
    const targetKeys = []
    const mockData = []
    for (let i = 0; i < 5; i++) {
      const data = {
        key: i.toString(),
        title: `拉取的数据${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: false
      }
      if (data.chosen) {
        targetKeys.push(data.key)
      }
      mockData.push(data)
    }
    this.dataSource = mockData
    this.selectedKeys = []
    this.targetKeys = targetKeys
  }
}
