var applicationContext = {
  designerServerApiAddr: '',
  getFileApiAddr: (fileId) => {
    return applicationContext.designerServerApiAddr + 'api/file/GetFile?fileId=' + fileId
  }
}

export default applicationContext
