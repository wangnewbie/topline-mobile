// dayjs插件
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 按需加载
import relativeTime from 'dayjs/plugin/relativeTime'
// dayjs插件
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

export default value => {
  return dayjs(value).fromNow()
}
