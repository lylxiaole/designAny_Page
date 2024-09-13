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

// import { Options, Vue } from 'vue-class-component'
// declare module '*.vue' {
//   export default Vue
// }
import Vue from 'vue'
declare module '*.vue' {
  export default Vue
}
// **************vue内部变量申明*******
import Vuex, { Store, createStore } from 'vuex'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<any>
  }
}
export {}
