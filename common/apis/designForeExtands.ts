import { ajaxGet, ajaxPost } from '@common/utils/axiosEnhancer'
import { getConfigByName } from '@common/baseConfigs'
import dataContactBase from './dataContactBase'
import { config } from 'webpack'
const apiAddr = () => getConfigByName('apiAddr')

export class ExtandFile {
  id: string
  name: string
  fileRelativePaths: string
  type: string
}

export async function addExtandFile(data: ExtandFile, files: File[]): Promise<string> {
  var formData = new FormData()
  files.forEach((file: any) => {
    formData.append('files', file.raw)
  })

  let url = apiAddr() + `api/foreExtands/addExtandFile?name=${data.name}&type=${data.type}`
  const resp = await ajaxPost(url, formData)
  return resp.data
}

export async function getAllExtandFiles(): Promise<ExtandFile[]> {
  let url = apiAddr() + `api/foreExtands/getAllExtandFiles`
  const resp = await ajaxGet(url)
  return resp.data
}

export async function deleteExtandFile(id: string): Promise<boolean> {
  let url = apiAddr() + `api/foreExtands/deleteExtandFile`
  const resp = await ajaxPost(url, id)
  return resp.data
}

export async function loadExtends() {
  let allfiles = await getAllExtandFiles()

  let filepaths = []
  for (let index = 0; index < allfiles.length; index++) {
    const file = allfiles[index]
    let paths = file.fileRelativePaths.split(',')
    paths.filter((o) => {
      if (filepaths.indexOf(o) < 0) {
        filepaths.push(o)
      }
    })
  }

  for (let index = 0; index < filepaths.length; index++) {
    const path = apiAddr() + filepaths[index]
    if (filepaths[index].indexOf('.js') > -1) {
      require(path)

      // var script1 = document.createElement('script')
      // script1.src = path
      // script1.type = 'text/javascript'
      // document.body.appendChild(script1)
    }

    if (filepaths[index].indexOf('.css') > -1) {
      // var link = document.createElement('link')
      // link.href = path
      // link.type = 'text/css'
      // link.rel = 'stylesheet'
      // document.body.appendChild(link)
    }
  }
}
