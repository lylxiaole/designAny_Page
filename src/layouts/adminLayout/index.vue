<template>
  <div class="about">
    <v-header />
    <v-sidebar />
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <v-tags></v-tags>
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="move" mode="out-in">
            <keep-alive :include="tagsList">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
        <!-- <el-backtop target=".content"></el-backtop> -->
      </div>
    </div>
  </div>
</template>
<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import vHeader from './Header.vue'
import vSidebar from './Sidebar.vue'
import vTags from './Tags.vue'
export default {
  components: {
    vHeader,
    vSidebar,
    vTags
  },
  setup() {
    const store = useStore()
    const tagsList = computed(() => store.state.system.tagsList.map((item) => item.name))
    const collapse = computed(() => store.state.collapse)
    onMounted(() => {
      window.console.log('onMounted:', store)
    })
    return {
      tagsList,
      collapse
    }
  }
}
</script>
