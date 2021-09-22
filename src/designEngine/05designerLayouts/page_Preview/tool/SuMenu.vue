
<template>
  <a-sub-menu :key="menuInfo.id" v-bind="$props" v-on="$listeners" style="height:66px;">
    <span slot="title">
      <div v-if="menuInfo.obj.iconUrl ===null">
        <a-icon type="folder" width="12px" /> <span>{{menuInfo.text}}</span>
      </div>
      <div v-if="menuInfo.obj.iconUrl !==null && isLeaf" style="height:26px;margin-bottom: 6px;" class="menuIcon">
        <!--      <img  style="height:26px;width:26px;line-height:22px;height:26x;vertical-align:top;padding-top: 12px;display:block;margin:auto;" :src="imgurl" />-->
        <v-icon :name="menuInfo.obj.iconUrl" class="menuIcon" />
        <span style="color:#DDECFF;font-size:16px;opacity:1;float: left;width: 100%;margin-top: -14px;">{{menuInfo.text}}</span>
      </div>
    </span>
    <template v-for="item in menuInfo.children">
      <a-menu-item v-if="item.type==1" :key="item.id" @click="tick(item,item.id)">
        <span class="circleNodeStyle"></span>
        <span>{{ item.text }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.id" :menu-info="item" @titleClick="changeMenu" v-on="$listeners" :isLeaf="false" />
    </template>
  </a-sub-menu>
</template>
<script>
import { Menu, Icon } from 'ant-design-vue'
import { CurrentContext } from '../../../01designerContext'
import common from '../../../02common/commonMethod'
export default {
  name: 'SubMenu',
  // must add isSubMenu: true
  isSubMenu: true, // $props.isSubMenu
  mounted() {
    this.fileServerAddress = CurrentContext.FileServerAddress
    if (this.menuInfo.obj.iconUrl !== null) {
      console.info('this.menuInfo', this.menuInfo)
      this.imgurl = BuildingFileUrlForShow(this.fileServerAddress, this.menuInfo.obj.iconUrl)
    }
  },
  props: {
    ...Menu.SubMenu.props, //
    // Cannot overlap with properties within Menu.SubMenu.props
    menuInfo: {
      type: Object,
      default: () => {}
    },
    selectedKeys: {
      type: Array,
      default: () => []
    },
    subMenuCollapsed: {
      type: Boolean,
      default: false
    },
    isLeaf: false
  },
  data() {
    return {
      fileServerAddress: null,
      imgurl: null
    }
  },
  components: {
    // 'a-menu': Menu,
    // 'a-sub-menu': Menu.SubMenu,
    // 'a-menu-item': Menu.Item,
    // 'a-icon': Icon,
  },
  methods: {
    // 点击子菜单标题
    changeMenu(menu) {
      // console.log('展开menu===',menu)
      // console.log('selectedKeys===',this.selectedKeys)
      this.$emit('titleClick', menu)
    },
    tick(item, id) {
      // console.log('$listeners===', this.$listeners)
      // console.log('$attrs===', this.$attrs)
      // console.log('$props===', this.$props)
      this.$emit('itemTick', item, id)
    }
  }
}
</script>
