<template>
  <div>
    <h1>{{ msg }}</h1>

    <p>
      systemCount:
      {{systemCount}}
    </p>

    <p>
      appCount:
      {{appCount}}
    </p>

    <button type="button" @click="btnClick">addCount</button>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ref, defineComponent } from 'vue'
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: false
    }
  },
  setup: () => {
    const store = useStore()
    window.console.log('store:', store)
    const systemCount = computed(() => store.state.system.systemCount)
    const appCount = computed(() => store.state.app.appCount)
    const btnClick = (e) => {
      store.commit('app/addAppCount', 1)
      store.commit('system/addSystemCount', 3)
    }

    return { systemCount, appCount, btnClick }
  }
})
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
