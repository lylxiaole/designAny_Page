import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  let xxx = Cookies.get(TokenKey)
  // window.console.log('getToken:', xxx)
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  window.console.log('setToken:', token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  window.console.log('removeToken:')
  return Cookies.remove(TokenKey)
}
