 
<template>
  <div>
    <template v-if="currentObj.objType=='signs'">
      <signChooser v-model:signObj="objProxy" />
    </template>
    <template v-else>
      <resourceChooser v-model:resourceObj="objProxy" />
    </template>
  </div>
</template>

<script  >
import { ref } from 'vue'

import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { EnginePage, EngineComponent, EngineLayout, layoutEventBehaviors } from '@designEngine/index'
import { deepClone, getUuid } from '@common/utils'

import { getSearchClass, pageSearchBase } from '@behaviorEngine/index'
import { behavior, action, actionDetail } from '@behaviorEngine/index'
import { objectType, resourceGroup, getFuncObjByObjType } from '@behaviorEngine/index'

import callbackSetting from './callbackSetting/callbackSetting.vue'
import signChooser from './signChooser.vue'
import resourceChooser from './resourceChooser.vue'

export default {
  components: {
    signChooser,
    resourceChooser
    // callbackSetting
  },
  data() {
    return {
      allSigns: [],
      callboackbehaviorid: '',
      currentSelectKey: undefined
    }
  },
  props: ['currentObj'],

  mounted() {
    this.allSigns = getFuncObjByObjType(objectType.signs)
  },
  methods: {
    getSelectedObj(id, groups) {
      for (let index = 0; index < groups.length; index++) {
        let group = groups[index]
        if (group.childrenObjs) {
          let findObj = group.childrenObjs.find((o) => o.resourceId == id)
          if (findObj) {
            return findObj
          }
        }
        if (group.childrenGroups) {
          let findObj = this.getSelectedObj(id, group.childrenGroups)
          if (findObj) {
            return findObj
          }
        }
      }
      return null
    }
  },
  computed: {
    currentTitle() {
      if (!this.currentSelectKey) {
        return '请选择'
      }
      var currentnode = this.allSigns.find((o) => o.resourceCode === this.currentSelectKey)
      return currentnode.name
    },
    objProxy: {
      get: function () {
        return this.currentObj
      },
      set: function (val) {
        this.$emit('update:currentObj', val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.caaa {
  display: none;
}
</style>
 