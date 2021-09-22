class breadcrumIcons {
  name: string
  value: string
}
export default class breadcrumAttributeInfos {
  key: string
  //面包屑名称
  breadcrumName: string
  //面包屑网址
  breadcrumRef: boolean
  //设置icon的方式
  breadcrumIconType: number
  //面包屑icon
  breadcrumIcon: breadcrumIcons

  //上传的图片
  breadcrumImage: any[]
  // imageUrl: string

  get allBreadcrumIcons(): any[] {
    if (this.breadcrumIconType == 1) {
      return [{ name: '根图标', value: 'home' }, { name: '用户图标', value: 'user' }, { name: '添加用户', value: 'user-add' }, { name: '删除用户', value: 'user-delete' }]
    } else {
      return this.breadcrumImage
    }
  }
}
