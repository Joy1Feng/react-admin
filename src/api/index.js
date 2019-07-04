import jsonp from 'jsonp'
import ajax from './ajax'
import {message} from "antd";

// 登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')
// 获取天气信息
export const reqWeather = (city) => {
  return new Promise((resole, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === 'success') {
        const {dayPictureUrl, weather} = data.results[0].weather_data[0]
        resole({dayPictureUrl, weather})
      } else {
        message.error('获取天气失败')
      }
    })
  })
}
// 获取一级二级列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId})

// 更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', {
  categoryId,
  categoryName
}, 'POST')
// 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {
  parentId,
  categoryName
}, 'POST')
// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {
  pageNum,
  pageSize
})

// 搜索商品分页列表
// searchType  搜索类型
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax('/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName
})
// 获取一个分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})

// 更新商品的状态
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus',
  {
    productId,
    status
  }, 'POST')

// 刪除上传图片
export const reqDeleteImg = name => ajax('/manage/img/delete', {name}, 'POST')

// 添加商品
export const reqAddOrUpdateproduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'),
  product, 'POST')

// 获取用户列表
export const reqUserList = () => ajax('/manage/user/list')

// 添加角色
export const reqAddUser = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')

// 更新角色权限
export const reqUpdateAuth = (_id, menus, auth_name, auth_time) => ajax('manage/role/update',
  {_id, menus, auth_name, auth_time},
  'POST'
)
















