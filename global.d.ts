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
  const classes: { readonly [key: string]: string; new () }

  export default classes
}
