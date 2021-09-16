import Vue from 'vue'

const flow = {
  state: {
    context: [],
    nodes: [],
    edges: [],
  },

  mutations: {
    SET_CONTEXT: (state, context) => {
      state.context = context
    },
    SET_NODES: (state, nodes) => {
      state.nodes = nodes
    },
    SET_EDGES: (state, edges) => {
      state.edges = edges
    },
  },

  actions: {
    setContext({ commit }, context) {
      commit('SET_CONTEXT', context)
    },
    setNodes({ commit }, nodes) {
      commit('SET_NODES', nodes)
    },
    setEdges({ commit }, edges) {
      commit('SET_EDGES', edges)
    },
  },
}

export default flow
