var behaviorContext = {
  designerServerApiAddr: '',
  allDictionary: [],
  allThirtyApis: [],
  currentDesignPage: null,
  getFileApiAddr: (fileId) => {
    return behaviorContext.designerServerApiAddr + 'api/file/GetFile?fileId=' + fileId
  },
  getAllPageInfos: () => {
    return null
  }
}

export default behaviorContext
