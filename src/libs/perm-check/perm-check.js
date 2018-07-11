import store from '../../store'

class PermCheck {
  static checkPerm (perm) {
    for (let item of store.state.user.access) {
      if (item === perm) {
        return true
      }
    }
    return false
  }

  // 资源新增
  static resSave () {
    return PermCheck.checkPerm('sys:resource:save')
  }

  // 资源修改
  static resUpdate () {
    return PermCheck.checkPerm('sys:resource:update')
  }

  // 资源删除
  static resDelete () {
    return PermCheck.checkPerm('sys:resource:delete')
  }

  // 权限新增
  static permSave () {
    return PermCheck.checkPerm('sys:permission:save')
  }

  // 权限修改
  static permUpdate () {
    return PermCheck.checkPerm('sys:permission:update')
  }

  // 权限删除
  static permDelete () {
    return PermCheck.checkPerm('sys:permission:delete')
  }

  // 部门新增
  static deptSave () {
    return PermCheck.checkPerm('sys:dept:save')
  }

  // 部门修改
  static deptUpdate () {
    return PermCheck.checkPerm('sys:dept:update')
  }

  // 部门删除
  static deptDelete () {
    return PermCheck.checkPerm('sys:dept:delete')
  }

  // 角色新增
  static roleSave () {
    return PermCheck.checkPerm('sys:role:save')
  }

  // 角色修改
  static roleUpdate () {
    return PermCheck.checkPerm('sys:role:update')
  }

  // 角色删除
  static roleDelete () {
    return PermCheck.checkPerm('sys:role:delete')
  }

  // 用户新增
  static userSave () {
    return PermCheck.checkPerm('sys:user:save')
  }

  // 用户修改
  static userUpdate () {
    return PermCheck.checkPerm('sys:user:update')
  }

  // 用户删除
  static userDelete () {
    return PermCheck.checkPerm('sys:user:delete')
  }

  // 字典目录新增
  static dictSave () {
    return PermCheck.checkPerm('sys:dict:save')
  }

  // 字典目录修改
  static dictUpdate () {
    return PermCheck.checkPerm('sys:dict:update')
  }

  // 字典目录删除
  static dictDelete () {
    return PermCheck.checkPerm('sys:dict:delete')
  }

  // 字典属性新增
  static dictOptionSave () {
    return PermCheck.checkPerm('sys:dict:option:save')
  }

  // 字典属性修改
  static dictOptionUpdate () {
    return PermCheck.checkPerm('sys:dict:option:update')
  }

  // 字典属性删除
  static dictOptionDelete () {
    return PermCheck.checkPerm('sys:dict:option:delete')
  }

  // 系统配置新增
  static configSave () {
    return PermCheck.checkPerm('sys:config:save')
  }

  // 系统配置修改
  static configUpdate () {
    return PermCheck.checkPerm('sys:config:update')
  }

  // 系统配置删除
  static configDelete () {
    return PermCheck.checkPerm('sys:config:delete')
  }

  // 系统配置属性新增
  static configOptionSave () {
    return PermCheck.checkPerm('sys:config:option:save')
  }

  // 系统配置属性修改
  static configOptionUpdate () {
    return PermCheck.checkPerm('sys:config:option:update')
  }

  // 系统配置属性删除
  static configOptionDelete () {
    return PermCheck.checkPerm('sys:config:option:delete')
  }
}

export default PermCheck
