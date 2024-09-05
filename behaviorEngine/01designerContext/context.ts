var behaviorContext = {
  designerServerApiAddr: '',
  allDictionary: [],
  allThirtyApis: [],
  getAllDictionary: async () => {
    return []
  },
  getAllThirtyApis: async () => {
    return []
  },
  currentDesignPage: null,
  getFileApiAddr: (fileId) => {
    return behaviorContext.designerServerApiAddr + 'api/file/GetFile?fileId=' + fileId
  },
  getAllPageInfos: () => {
    return null
  }
}

export default behaviorContext
