var designerContext = {
  designerServerApiAddr: '',
  getFileApiAddr: (fileId) => {
    return designerContext.designerServerApiAddr + 'api/file/GetFile?fileId=' + fileId
  }
}

export default designerContext
