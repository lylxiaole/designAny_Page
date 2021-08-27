<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9"
      active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" :key="item.index">
            <template #title>
              <i class="iconfont" :class="item.icon" />
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-sub-menu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}</el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i class="menuIcon iconfont" :class="item.icon" />
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import { getRoutes } from '@src/baseConfigs'

function loopMenuItem(menus, topLayoutPath, parentRoutePath = undefined) {
  let res = []
  if (!menus) {
    return res
  }
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index]
    if (!menu.path || menu.path === topLayoutPath) {
      res = res.concat(loopMenuItem(menu.children, topLayoutPath))
      continue
    }

    let routepath = (parentRoutePath ? parentRoutePath : '') + menu.path
    if (routepath.indexOf(topLayoutPath) < 0) {
      continue
    }
    if (menu.hidden) {
      continue
    }

    res.push({
      icon: menu.icon,
      title: menu.meta?.title,
      index: routepath,
      subs: menu.children ? loopMenuItem(menu.children, topLayoutPath, routepath) : undefined
    })
  }
  return res
}

export default {
  setup() {
    const route = useRoute()
    window.console.log('route', route)
    debugger
    let allRoutes = getRoutes()
    let items = loopMenuItem(allRoutes, '/')

    const onRoutes = computed(() => {
      return route.path
    })

    const store = useStore()
    const collapse = computed(() => store.state.system.collapse)

    return {
      items,
      onRoutes,
      collapse
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
  .menuIcon {
    font-size: 16px;
    margin-right: 18px;
  }
}

.sidebar-el-menu.el-menu--collapse {
  .menuIcon {
    font-size: 25px;
    width: 100%;
    height: 100%;
  }
}

.sidebar > ul {
  height: 100%;
}
</style>
