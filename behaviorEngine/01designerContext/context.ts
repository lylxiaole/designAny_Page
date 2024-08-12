var behaviorContext = {
  designerServerApiAddr: '',
  getFileApiAddr: (fileId) => {
    return behaviorContext.designerServerApiAddr + 'api/file/GetFile?fileId=' + fileId
  },
  getAllDictionary: async (): Promise<any[]> => {
    return []
  },
  getAllThirtyApis: async (): Promise<any[]> => {
    return []
  }
}

export default behaviorContext
