<template>
  <div>
    <div style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd">
      <VueFlow v-model="nodes" v-model:edges="edges">
      </VueFlow>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { VueFlow } from '@vue-flow/core'

@Options({
  components: {
    VueFlow: VueFlow
  }
})
export default class index extends ComponentBase {
  // @Prop({ default: null })
  // private currentApiContent: ApiContentDC

  private nodes: any[] = [
    // an input node, specified by using `type: 'input'`
    {
      id: '1',
      type: 'input',
      position: { x: 250, y: 5 },
      // all nodes can have a data object containing any data you want to pass to the node
      // a label can property can be used for default nodes
      data: { label: 'Node 1' }
    },

    // default node, you can omit `type: 'default'` as it's the fallback type
    {
      id: '2',
      position: { x: 100, y: 100 },
      data: { label: 'Node 2' }
    },

    // An output node, specified by using `type: 'output'`
    {
      id: '3',
      type: 'output',
      position: { x: 400, y: 200 },
      data: { label: 'Node 3' }
    },

    // this is a custom node
    // we set it by using a custom type name we choose, in this example `special`
    // the name can be freely chosen, there are no restrictions as long as it's a string
    {
      id: '4',
      type: 'special', // <-- this is the custom node type name
      position: { x: 400, y: 200 },
      data: {
        label: 'Node 4',
        hello: 'world'
      }
    }
  ]
  private edges: any[] = [
    // default bezier edge
    // consists of an edge id, source node id and target node id
    {
      id: 'e1->2',
      source: '1',
      target: '2'
    },

    // set `animated: true` to create an animated edge path
    {
      id: 'e2->3',
      source: '2',
      target: '3',
      animated: true
    },

    // a custom edge, specified by using a custom type name
    // we choose `type: 'special'` for this example
    {
      id: 'e3->4',
      type: 'special',
      source: '3',
      target: '4',

      // all edges can have a data object containing any data you want to pass to the edge
      data: {
        hello: 'world'
      }
    }
  ]

  mounted() {}

  private async startDesignApp() {
    // this.$router.push({ path: '/designPages', query: { appId: this.currentApplication.id } })
  }
}
</script>

<style>
</style>