/*
* 用于保存获取移除localstorage的值
*
* */
import store from 'store'

export const USER_KEY = 'user_key'
//保存user
export const saveUser = user => {
  // localStorage.setItem(USER_KEY, JSON.stringify(user))
  store.set(USER_KEY, user)
}
//读取user
// export const getUser = () => JSON.parse(localStorage.getItem(USER_KEY) || '{}')
export const getUser = () => store.get(USER_KEY) || {}
//移除user
// export const deleteUser = () => localStorage.removeItem(USER_KEY)
export const deleteUser = () => store.remove(USER_KEY)
