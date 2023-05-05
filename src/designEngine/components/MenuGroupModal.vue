<template>
  <a-modal title="分组列表" :maskClosable="false" :confirm-loading="confirmLoading" destroyOnClose v-model="isVisible" :width="900" :height="500"
    @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="确定" :okButtonProps="{ props: { icon: 'check' } }"
    :cancelButtonProps="{ props: { icon: 'close' } }">
    <a-row>
      <a-col :span="isEditable?12:24">
        <a-layout style="background:#fff;">
          <div>
            <area-title title='分组列表'></area-title>
            <g-button v-if="isEditable" buttonType="add" buttonArea="area" @click="addMenuGroup"></g-button>
          </div>
          <a-table height="100%" size="middle" rowKey="id" :loading="tableLoading" :columns="groupColumns" :row-selection="rowSelection"
            :dataSource="groupDataList" :pagination="false" :customRow="rowClick" bordered>
            <span slot="serial" slot-scope="text,record,index">
              {{ getMenuIndex(record,index) }}
            </span>
            <span slot="name" slot-scope="text,record">
              {{text}}
              <a-tag v-if="record.is_default===1" color="green"> 默认</a-tag>
            </span>
            <span slot="action" slot-scope="text,record,index">
              <a-tooltip placement="top">
                <a-button icon="up" :disabled="index===0?true:false" @click="()=>{moveUp(record.id)}" type="link"></a-button>
              </a-tooltip>
              <a-divider type="vertical" />
              <a-tooltip placement="top">
                <a-button icon="down" :disabled="(index+1)===groupDataList.length?true:false" @click="()=>{moveDown(record.id)}" type="link">
                </a-button>
              </a-tooltip>
              <a-divider type="vertical" />
              <a-tooltip placement="top">
                <a-button icon="delete" @click="()=>{deleteMg(record.id)}" type="link"></a-button>
              </a-tooltip>
            </span>
          </a-table>
        </a-layout>
      </a-col>
      <a-col v-if="isEditable" :span="12" style="padding:0px 0px 0px 12px;">
        <a-layout style="background:#fff;">
          <area-title title='分组属性'></area-title>
          <detail-list :col="1">
            <detail-list-item term="名称">
              <a-input placeholder="名称" v-model="currentMenuGroup.group_name" />
            </detail-list-item>
            <detail-list-item term="默认">
              <a-switch :default-checked="false" :checked="currentMenuGroup.is_default===1"
                @change="(checked)=>{onDefaultSwitchChange(currentMenuGroup,checked)}" checked-children="是" un-checked-children="否" />
            </detail-list-item>
            <detail-list-item term="图标">
              <a-row>
                <a-col :span="16">
                  <v-icon viewBox="0 0 100 100" v-if="currentMenuGroup!=null&&currentMenuGroup.icon_url!=null" :name="currentMenuGroup.icon_url" />
                </a-col>
                <a-col :offset="4" :span="4">
                  <a-button v-if="currentMenuGroup!=null" shape="circle" icon="plus" @click="()=>{iconSelectorVisible=true;}" />
                </a-col>
              </a-row>
            </detail-list-item>
          </detail-list>
        </a-layout>
      </a-col>
    </a-row>
    <a-modal title="图标" :maskClosable="false" :destroyOnClose="true" v-model="iconSelectorVisible" :width="900" :height="500" @ok="handleIconOk"
      @cancel="handleIconCancel" cancelText="取消" okText="确定" :okButtonProps="{ props: { icon: 'check' } }"
      :cancelButtonProps="{ props: { icon: 'close' } }">
      <icon-manage :isMulti="false" :isSelector="true" @onSelected="onIconSelected"></icon-manage>
    </a-modal>
  </a-modal>
</template>

<script lang="ts">
import { error } from 'jquery'
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit } from 'vue-property-decorator'
import { CurrentApis } from '../01designerContext'
import { appMenuGroup } from '@/api/userManage'
import { batchAdd, batchUpdate } from '@/api/crud'
import { AreaTitle, GButton } from '@/components'
import iconManage from '@views/npicon/iconManage.vue'
import { DetailList } from '@/components'

// 操作类型枚举
enum OperationType {
  ADD, // 新增
  UPDATE, // 更新
  QUERY // 查询
}

@Options({
  name: 'MenuGroupModal',
  components: { iconManage, AreaTitle, GButton, DetailList, DetailListItem: DetailList.Item }
})
export default class MenuGroupModal extends Vue {
  @Prop({ required: true })
  private appId: any

  @Prop({ required: true })
  private topMenuId: any

  @PropSync('visible', { type: Boolean, default: false })
  private isVisible!: boolean

  @Watch('visible', { immediate: true })
  onIsVisibleChanged(nVal: boolean) {
    if (nVal) {
      this.LoadTableData()
    }
  }

  @Prop({ required: false, default: true })
  private isEditable!: boolean

  @Watch('isEditable', { immediate: true })
  isEditableChanged(newVal: boolean, oldVal: boolean) {
    if (newVal) {
      this.rowSelection = null
      this.groupColumns = [
        {
          title: '#',
          width: 50,
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '名称',
          dataIndex: 'group_name',
          key: 'group_name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '操作',
          key: 'action',
          width: 160,
          scopedSlots: { customRender: 'action' }
        }
      ]
    } else {
      this.rowSelection = { type: 'radio', onChange: this.onSelectChange }
      this.groupColumns = [
        {
          title: '#',
          width: 50,
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '名称',
          dataIndex: 'group_name',
          key: 'group_name',
          scopedSlots: { customRender: 'name' }
        }
      ]
    }
  }

  // @Prop({ required: false })
  // selectedItem: any

  private tableLoading: boolean = false

  private selectedRowKeys: any[] = []

  private rowSelection: any = { type: 'radio', onChange: this.onSelectChange }

  private selectedMenuGroup: any = {}

  private currentMenuGroup: any = {}

  @Watch('currentMenuGroup', { deep: true, immediate: false })
  onCurrentMenuGroupChanged(newValue: any, oldValue: any) {
    if (newValue && oldValue && newValue.id && oldValue.id && newValue.id === oldValue.id && newValue.operationType === OperationType.QUERY) {
      this.currentMenuGroup.operationType = OperationType.UPDATE
    }
  }

  private confirmLoading: boolean = false

  private groupColumns: any[] = [
    {
      title: '#',
      width: 50,
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '名称',
      dataIndex: 'group_name',
      key: 'group_name',
      scopedSlots: { customRender: 'name' }
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      scopedSlots: { customRender: 'action' }
    }
  ]
  private groupDataList: any[] = []

  private deleteGroupList: any[] = []

  private iconSelectorVisible: boolean = false

  private LoadTableData() {
    this.tableLoading = true
    let param = {
      filter: [
        {
          code: 'app_id',
          type: 'EQ',
          value: this.appId
        },
        {
          code: 'parent_menu_id',
          type: 'EQ',
          value: this.topMenuId
        }
      ],
      orders: [
        {
          code: 'modify_time',
          type: 'ASC'
        }
      ],
      modelCode: 'sys_app_menu_group'
    }
    CurrentApis.SimpleListQuery(param)
      .then((res: any) => {
        res.forEach((element) => {
          element.operationType = OperationType.QUERY
        })
        this.groupDataList = res
      })
      .catch((error) => {
        this.$message.error(error)
      })
      .finally(() => {
        this.tableLoading = false
      })
  }

  private selectedIcon: string

  private onIconSelected(selectedIcons) {
    if (selectedIcons && selectedIcons.length > 0) {
      this.selectedIcon = selectedIcons[0].icon_code
    }
  }

  private handleIconOk() {
    if (this.selectedIcon != null) {
      this.currentMenuGroup.icon_url = this.selectedIcon
      this.selectedIcon = null
    }
    this.iconSelectorVisible = false
  }

  private handleIconCancel(e) {
    this.selectedIcon = null
    this.iconSelectorVisible = false
  }

  private deleteMg(id: string) {
    const theGroupIndex = this.groupDataList.findIndex((o) => o.id == id)
    const theGroup = this.groupDataList.find((o) => o.id == id)
    if (theGroupIndex >= 0 && theGroup) {
      this.groupDataList.splice(theGroupIndex, 1)
      if (theGroup.operationType != OperationType.ADD) {
        this.deleteGroupList.push(theGroup)
      }
    }
  }

  private addMenuGroup() {
    var newMg = {
      id: CurrentApis.GetServerUUID(),
      group_name: '新建分组',
      icon_url: 'MES_Menu_Basic',
      app_id: this.appId,
      parent_menu_id: this.topMenuId,
      is_default: 0,
      operationType: OperationType.ADD
    }
    this.groupDataList.push(newMg)
  }

  //顺序向上移动
  private moveUp(id: string) {
    let findindex = this.groupDataList.findIndex((o) => o.id == id)
    if (findindex == 0) {
      return
    }
    let find = this.groupDataList.find((o) => o.id == id)
    let taget = this.groupDataList[findindex - 1]
    // this.groupDataList[findindex] = taget
    // this.groupDataList[findindex - 1] = find

    this.$set(this.groupDataList, findindex, taget)
    this.$set(this.groupDataList, findindex - 1, find)
  }

  //顺序向下移动
  private moveDown(id: string) {
    let findindex = this.groupDataList.findIndex((o) => o.id == id)
    if (findindex == this.groupDataList.length - 1) {
      return
    }
    let find = this.groupDataList.find((o) => o.id == id)
    let taget = this.groupDataList[findindex + 1]

    this.$set(this.groupDataList, findindex, taget)
    this.$set(this.groupDataList, findindex + 1, find)

    // this.groupDataList[findindex] = taget
    // this.groupDataList[findindex + 1] = find
    // this.$forceUpdate()
  }

  private onSelectChange(selectedRowKeys: any[]) {
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const group = this.groupDataList.find((o) => o.id == selectedRowKeys[0])
      this.selectedMenuGroup = group
    }
  }

  /* 是否默认开关变化时触发的事件 */
  private onDefaultSwitchChange(group: any, checked: boolean) {
    if (group) {
      group.is_default = checked ? 1 : 0
      if (checked) {
        this.groupDataList.forEach((it) => {
          if (it.id !== group.id) {
            it.is_default = 0
          }
        })
      }
    }
  }

  private rowClick(record, index) {
    return {
      on: {
        click: () => {
          this.currentMenuGroup = record
        }
      }
    }
  }

  private getMenuIndex(record: any, index: number): number {
    let realIndex = index + 1
    record.order_index = realIndex
    if (record.operationType === OperationType.QUERY) {
      record.operationType = OperationType.UPDATE
    }
    return realIndex
  }

  private handleOk() {
    let that = this
    this.confirmLoading = true
    if (this.isEditable) {
      let groupData = {
        appId: this.appId,
        menuId: this.topMenuId,
        appMenuGroupsToAdd: [],
        appMenuGroupsToDelete: [],
        appMenuGroupsToUpdate: []
      }
      //删除
      if (this.deleteGroupList && this.deleteGroupList.length > 0) {
        this.deleteGroupList.forEach((x) => {
          groupData.appMenuGroupsToDelete.push(x.id)
        })
      }
      //更新
      let updateList = this.groupDataList.filter((x) => x.operationType === OperationType.UPDATE)
      if (updateList && updateList.length > 0) {
        groupData.appMenuGroupsToUpdate = updateList
      }
      //新增
      let addList = this.groupDataList.filter((x) => x.operationType === OperationType.ADD)
      if (addList && addList.length > 0) {
        groupData.appMenuGroupsToAdd = addList
      }

      appMenuGroup(groupData)
        .then((res: any) => {
          that.confirmLoading = false
          if (res.code == '0') {
            this.$notification['success']({
              message: '提示',
              description: '保存成功',
              duration: 8
            })
            that.isVisible = false
          } else {
            this.$notification['warn']({
              message: '提示',
              description: res ? res.msg : '删除失败',
              duration: 8
            })
          }
        })
        .catch((err) => {
          that.confirmLoading = false
          this.$message.error(error)
        })
    } else {
      this.onOk(this.selectedMenuGroup)
      that.confirmLoading = false
      that.isVisible = false
    }
  }

  private handleCancel(e) {
    this.isVisible = false
  }

  @Emit('onOk')
  onOk(itemData: any) {}
}
</script>

<style>
</style>