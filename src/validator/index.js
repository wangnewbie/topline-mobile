import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'

Vue.use(VeeValidate)
Validator.localize('zh_CN', zhCN)
Validator.extend('mobile', {
  getMessage: field => '手机号格式不正确',
  validate: value => value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
})
// const Dictionary = {
//   zh_CN: {
//     messages: {
//       required: field => '请输入' + field
//     },
//     attributes: {
//       name: '账号'
//     }
//   }
// }
// // 自定义validate error 信息
// Validator.localize(Dictionary)
