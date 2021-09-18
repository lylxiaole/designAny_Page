import Vue from 'vue'

export default class HookBase {
  protected container: Vue

  protected beforeCreated() {}
  protected created() {}
  protected beforeMounted() {}
  protected mounted() {}
  protected beforeDestroy() {}
  protected destoryed() {}
}
