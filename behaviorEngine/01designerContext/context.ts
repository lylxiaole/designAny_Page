var behaviorContext = {
  designerServerApiAddr: '',
  getFileApiAddr: (fileId) => {
    return behaviorContext.designerServerApiAddr + 'api/file/GetFile?fileId=' + fileId
  }
}

export default behaviorContext
