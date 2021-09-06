<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'appLayout',
  components: {},
  mounted() {},
  computed: {
    tabbars: function() {
      return this.$store.state.system.tagsList
    }
  },
  methods: {
    onClickLeft() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    onChange() {}
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>

