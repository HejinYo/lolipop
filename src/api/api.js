import axios from 'axios'

const baseUrl = '/api'

// 请求登录
export const requestLogin = params => { return axios.post(`${baseUrl}/login`, params).then(res => res.data) }

// 退出登录
export const requestLogOut = () => { return axios.get(`${baseUrl}/logout`).then(res => res.data) }

/**
 * 用户管理
 */

// 用户分页查询
export const userListPage = (method, data, params) => {
  return axios({
    url: `${baseUrl}/user/listPage`,
    method: method,
    data: data,
    params: params
  }).then(res => res.data)
}

// 添加用户
export const reqUserSave = params => { return axios.post(`${baseUrl}/user`, params).then(res => res.data) }

// 查询一个用户信息
export const reqUserInfo = userId => { return axios.get(`${baseUrl}/user/` + userId).then(res => res.data) }

// 修改用户
export const reqUserUpdate = (userId, params) => { return axios.put(`${baseUrl}/user/` + userId, params).then(res => res.data) }

// 删除用户
export const reqUserDelete = userIds => { return axios.delete(`${baseUrl}/user/` + userIds).then(res => res.data) }

// 角色分页查询
export const reqRoleListPage = (method, data, params) => {
  return axios({
    url: `${baseUrl}/role/listPage`,
    method: method,
    data: data,
    params: params
  }).then(res => res.data)
}

/**
 * 角色管理
 */

// 添加角色
export const reqRoleSave = params => { return axios.post(`${baseUrl}/role`, params).then(res => res.data) }

// 查询一个角色信息
export const reqRoleInfo = roleId => { return axios.get(`${baseUrl}/role/` + roleId).then(res => res.data) }

// 修改角色
export const reqRoleUpdate = (roleId, params) => { return axios.put(`${baseUrl}/role/` + roleId, params).then(res => res.data) }

// 删除角色
export const reqRoleDelete = roleIds => { return axios.delete(`${baseUrl}/role/` + roleIds).then(res => res.data) }

// 获取角色拥有权限
export const reqRolePerm = roleId => { return axios.get(`${baseUrl}/permission/granted/` + roleId).then(res => res.data) }

// 加载权限树
export const reqPermissionTree = () => { return axios.get(`${baseUrl}/permission/authTree`).then(res => res.data) }

// 角色授权
export const reqAuthorization = (roleId, params) => { return axios.post(`${baseUrl}/role/authorization/` + roleId, params).then(res => res.data) }

/**
 * 资源管理
 */

// 资源分页查询
export const reqResourceListPage = params => { return axios.get(`${baseUrl}/resource/listPage`, {params: params}).then(res => res.data) }

// 加载资源树
export const reqResourceTree = () => { return axios.get(`${baseUrl}/resource/tree`).then(res => res.data) }

// 添加资源
export const reqResourceSave = params => { return axios.post(`${baseUrl}/resource`, params).then(res => res.data) }

// 查询一个资源信息
export const reqResourceInfo = resId => { return axios.get(`${baseUrl}/resource/` + resId).then(res => res.data) }

// 修改资源
export const reqResourceUpdate = (resId, params) => { return axios.put(`${baseUrl}/resource/` + resId, params).then(res => res.data) }

// 删除资源
export const reqResourceDelete = resIds => { return axios.delete(`${baseUrl}/resource/` + resIds).then(res => res.data) }

// 权限分页查询
export const reqPermissionListPage = params => { return axios.get(`${baseUrl}/permission/listPage`, {params: params}).then(res => res.data) }

// 添加权限
export const reqPermissionSave = params => { return axios.post(`${baseUrl}/permission`, params).then(res => res.data) }

// 查询一个权限信息
export const reqPermissionInfo = permId => { return axios.get(`${baseUrl}/permission/` + permId).then(res => res.data) }

// 修改权限
export const reqPermissionUpdate = (permId, params) => { return axios.put(`${baseUrl}/permission/` + permId, params).then(res => res.data) }

// 删除权限
export const reqPermissionDelete = permIds => { return axios.delete(`${baseUrl}/permission/` + permIds).then(res => res.data) }

/**
 * 日志管理
 */

// 日志分页查询
export const reqLogListPage = (method, data, params) => {
  return axios({
    url: `${baseUrl}/log/listPage`,
    method: method,
    data: data,
    params: params
  }).then(res => res.data)
}

// 删除日志
export const reqLogDelete = ids => { return axios.delete(`${baseUrl}/log/` + ids).then(res => res.data) }

// 查询一个日志信息
export const reqLogInfo = id => { return axios.get(`${baseUrl}/log/` + id).then(res => res.data) }

/**
 * 配置管理
 */
// 配置分页查询
export const configListPage = (method, data, params) => {
  return axios({
    url: `${baseUrl}/config/listPage`,
    method: method,
    data: data,
    params: params
  }).then(res => res.data)
}

// 添加配置
export const reqConfigSave = params => { return axios.post(`${baseUrl}/config`, params).then(res => res.data) }

// 查询一个配置信息
export const reqConfigInfo = configId => { return axios.get(`${baseUrl}/config/` + configId).then(res => res.data) }

// 修改配置
export const reqConfigUpdate = (configId, params) => { return axios.put(`${baseUrl}/config/` + configId, params).then(res => res.data) }

// 删除配置
export const reqConfigDelete = configIds => { return axios.delete(`${baseUrl}/config/` + configIds).then(res => res.data) }
