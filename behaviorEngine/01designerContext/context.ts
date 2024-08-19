var behaviorContext = {
  designerServerApiAddr: '',
  allDictionary: [],
  allThirtyApis: [],

  getFileApiAddr: (fileId) => {
    return behaviorContext.designerServerApiAddr + 'api/file/GetFile?fileId=' + fileId
  },
  getAllPageInfos: () => {
    return null
  }
}

export default behaviorContext
