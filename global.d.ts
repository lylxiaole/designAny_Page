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

// declare module '*.vue' {
//   import { Options, Vue } from 'vue-class-component'

//   export default Vue
// }

// **************vue申明*******
import Vuex, { Store, createStore } from 'vuex'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<any>
  }
}
export {}
