declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
declare module '*.less' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
// import Vue, { ComponentOptions } from 'vue'
// declare module 'vue/types/options' {
//   interface ComponentOptions<V extends Vue, Data = DefaultData<V>, Methods = DefaultMethods<V>, Computed = DefaultComputed, PropsDef = PropsDefinition<DefaultProps>, Props = DefaultProps> {
//     asyncData?: Function
//     fetch?: Function
//     head?: object | Function
//     layout?: string | Function
//     middleware?: string | string[]
//     scrollToTop?: boolean
//     transition?: String | object | Function
//     validate?: Function
//     watchQuery?: boolean | string[]
//   }
// }
