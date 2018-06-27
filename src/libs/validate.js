export const validatePhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号码'))
  } else {
    let reg = /^$|^((13[0-9])|(14[0-9])|(15[^4,\D])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/
    if (!reg.test(value)) {
      callback('手机号码格式不正确')
    }
    callback()
  }
}
