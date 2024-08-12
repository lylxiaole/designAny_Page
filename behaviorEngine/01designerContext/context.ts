var behaviorContext = {
  designerServerApiAddr: '',
  getFileApiAddr: (fileId) => {
    return behaviorContext.designerServerApiAddr + 'api/file/GetFile?fileId=' + fileId
  },
  getAllDictionary: () => {},
  getAllThirtyApis: () => {}
}

export default behaviorContext
