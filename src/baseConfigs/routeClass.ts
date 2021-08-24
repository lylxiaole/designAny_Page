export class IRouteClass {
  title: string
  icon?: string
  name?: string
  path: string
  hidden?: boolean
  component?: any

  children?: IRouteClass[]
}
