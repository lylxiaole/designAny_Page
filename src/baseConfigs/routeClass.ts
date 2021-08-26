export class IRouteClass {
  meta?: any
  icon?: string
  name?: string
  path: string
  redirect?: string
  hidden?: boolean
  component?: any

  children?: IRouteClass[]
}
