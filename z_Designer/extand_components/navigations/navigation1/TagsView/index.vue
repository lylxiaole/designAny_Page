<template>
  <div id="tags-view-container" class="tags-view-container" style="overflow-y: hidden">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <!-- :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" -->

      <router-link v-for="tag in visitedViews" ref="tag" :key="tag.id" :class="isActive(tag) ? 'active' : ''" class="tags-view-item" @contextmenu.prevent="openMenu(tag, $event)" @mouseup="selectMenu(tag)">
        {{ getTagName(tag) }}
        <el-icon @click.prevent.stop="closeSelectedTag(tag)"><Close /></el-icon>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <!-- <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li> -->
    </ul>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import path from 'path'
import { Close } from '@element-plus/icons-vue'

export default {
  components: { ScrollPane, Close },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  props: {
    currentPageId: {
      default: null
    },
    allPages: {
      default: []
    }
  },
  computed: {
    visitedViews() {
      return this.allPages
    },
    routes() {
      return []
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    isActive(page) {
      return page.id === this.currentPageId
    },
    getTagName(page) {
      return page.properties.find((o) => o.field === 'name').value
    },

    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {},
    addTags() {
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('system/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('system/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      this.$emit('closeSelectedTag', view)
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('system/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('system/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some((tag) => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag

      this.$emit('selectedTag', tag)
    },
    selectMenu(tag) {
      this.selectedTag = tag

      this.$emit('selectedTag', tag)
    },

    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  width: 100%;

  :deep() .el-scrollbar__view {
    height: 100%;
  }

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 100%;
      height: 100%;
      color: var(--el-menu-text-color);
      background: var(--el-menu-bg-color);
      padding: 8px 8px 8px 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 15px;
      border-radius: 8px 8px 0 0;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: var(--el-menu-active-color);
        color: #fff;
        border-color: var(--el-menu-active-color);
        &::before {
          content: '';
          background: #fff;
          display: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
