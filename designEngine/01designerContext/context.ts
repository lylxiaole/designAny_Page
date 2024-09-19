import ApplicationContext from '@design-any/interface/dist/LayoutInterface/ApplicationContext'

var applicationContext: ApplicationContext = {
  engineServerApiAddr: '',
  getFileApiAddr: function (fileId) {
    return this.engineServerApiAddr + 'api/file/GetFile?fileId=' + fileId
  },
  getPageDetailById: async function (pageId: string) {}
}

export default applicationContext
