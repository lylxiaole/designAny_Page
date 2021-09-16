const getters = {
  device: (state) => state.app.device,
  theme: (state) => state.app.theme,
  color: (state) => state.app.color,
  token: (state) => state.user.token,
  avatar: (state) => state.user.imageUrl,
  nickname: (state) => state.user.name,
  welcome: (state) => state.user.welcome,
  roles: (state) => state.user.roles,
  userInfo: (state) => state.user.info,
  platformType: (state) => state.user.platformType,
  wsSocket: (state) => state.user.wsSocket,
  addRouters: (state) => state.permission.addRouters,
  multiTab: (state) => state.app.multiTab,
  flowContext: (state) => state.flow.context,
  flowNodes: (state) => state.flow.nodes,
  flowEdges: (state) => state.flow.edges,
}

export default getters